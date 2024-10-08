const schedule = require('node-schedule');
const moment = require('moment');
const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const MonthlySpend = require('../models/MonthlySpend');

export const updateMonthlySpend = async function(userId, amount, marketing_amount) {
	const user = await User.findById(userId);
	if (!user) {
		throw new Error('User not found');
	}
	const currentDate = moment().toDate();
	if (!user.monthly_spend || !user.monthly_spend.activityDate) {
		// Если пользователь еще не совершал покупок, создаем для него объект monthly_spend с текущей датой
		user.monthly_spend = {
			amount: amount,
			marketing_amount: marketing_amount,
			activityDate: currentDate
		};
		console.log('!user.monthly_spend', user.monthly_spend);
	} else {
		console.log('else 1 user.monthly_spend.activityDate', user.monthly_spend.activityDate);
		const currentMonth = moment().month();
		const currentYear = moment().year();
		const month = moment(user.monthly_spend.activityDate).month();
		const year = moment(user.monthly_spend.activityDate).year();
		console.log('month', month,year,'user.monthly_spend',user.monthly_spend);
		if (month !== currentMonth || year !== currentYear) {
			console.log('month/year !== currentMonth/currentYear', month, currentMonth, year, currentYear);
			// Текущий месяц отличается от месяца в monthly_spend, сохраняем текущие значения в отдельную таблицу
			const monthlySpend = new MonthlySpend({
				userId: userId,
				amount: user.monthly_spend.amount,
				marketing_amount: user.monthly_spend.marketing_amount,
				activityDate: user.monthly_spend.activityDate
			});
			await monthlySpend.save();
			// Обнуляем monthly_spend
			user.monthly_spend = {
				amount: amount,
				marketing_amount: marketing_amount,
				activityDate: currentDate
			};
		} else { 
			console.log('else 2  у чела совпадает month&year увеличиваем значения');
			// Текущий месяц и год совпадают с месяцем/годом в monthly_spend, обновляем значения
			user.monthly_spend.amount += amount;
			user.monthly_spend.marketing_amount += marketing_amount;
		}
	}
	console.log('updateMonthlySpend user.monthly_spend', user.monthly_spend);
	await user.save();
};

// Создаем расписание для запуска функции каждый день в полночь
export const dayJob = schedule.scheduleJob('0 0 * * *', async function() {
	await processReferralPayments();
	console.log('dayJob');
	// Получаем список всех пользователей
	const users = await User.find({ monthly_spend: { $exists: true } });
	// Получаем текущий месяц
	const currentDate = moment().toDate();
	const currentMonth = moment().month();
	const currentYear = moment().year();
	// Обходим всех пользователей и обнуляем monthly_spend для текущего месяца
	for (const user of users) {
		const monthlySpend = user.monthly_spend;
		if (!monthlySpend) {
			// Если у пользователя нет поля monthly_spend, то он не проявил активность и пропускаем его
			continue;
		}
		const month = moment(monthlySpend.date).month();
		const year = moment(monthlySpend.date).year();
		if (month !== currentMonth || year !== currentYear) {
			// Текущий месяц отличается от месяца в monthly_spend, обнуляем monthly_spend
			const monthlySpend = new MonthlySpend({
				userId: user._id,
				amount: user.monthly_spend.amount,
				marketing_amount: user.monthly_spend.marketing_amount,
				activityDate: user.monthly_spend.activityDate
			});
			await monthlySpend.save();
			user.monthly_spend = {
				amount: 0,
				marketing_amount: 0,
				activityDate: currentDate
			};
			await user.save();
		}
	}
});

export const processReferralPayments = async () => {
	try{
		const start = new Date().getTime();
		const currentMonth = moment().month();
		const currentYear = moment().year();
		// await createBackup(User);
		console.log('!!!start processReferralPayments!!!', start);
		const orders = await Order.find({ isProcessed: false }); // получаем все необработанные заказы
		console.log('orders length', orders.length);
		let completedSteps=0;
		const getReferralUsers = async function (
			order_date,
			userId,
			maxDepth = 0,
			activityPrice = 0,
			currentDepth = 0,
			referers = new Set(),
			processed = new Set()
		) {
			if (currentDepth >= maxDepth || processed.has(userId)) {
				return Array.from(referers);
			}
			processed.add(userId); // Mark the user as processed to avoid circular references
			const user = await User.findById(userId);
			if (!user) {
				console.log('getReferralUsers ~~~~User not found~~~');
				throw new Error('User not found');
			}
			const { referralLink } = user;
			if (!referralLink) {
				return Array.from(referers);
			}
			const referer = await User.findById(referralLink);
			if (!referer) {
				console.log('!referer конец поиска',referer.id);
				return Array.from(referers);
			}
			if(!referer.monthly_spend ||!referer.monthly_spend.activityDate){					
				console.log('getReferralUsers ~~~~NO push to ref search next 1~~~ id:',referer.id);
				await getReferralUsers(order_date, referer._id, maxDepth, activityPrice, currentDepth, referers, processed);
			}
			// Check if the referer's activityDate is within the same month and year as the order_date
			const refererActivityDate = referer.monthly_spend.activityDate;
			if (moment(refererActivityDate).isSame(order_date, 'month') && moment(refererActivityDate).isSame(order_date, 'year')) {
			// Check if the referer's monthly_spend is valid for the given activityPrice
				if (!referer.monthly_spend || !referer.monthly_spend.amount || referer.monthly_spend.amount < activityPrice) {
					console.log('getReferralUsers ~~~~NO push to ref search next 2~~~ id:',referer.id);
					await getReferralUsers(order_date, referer._id, maxDepth, activityPrice, currentDepth, referers, processed);
				} else {
					console.log('getReferralUsers ~~~~push to ref~~~ id:',referer.id);
					referers.add(referer); // Add the valid referer to the set
					await getReferralUsers(order_date, referer._id, maxDepth, activityPrice, currentDepth + 1, referers, processed);
				}
			} else {
				// Check the activity in a different month for the referer
				const monthlySpend = await MonthlySpend.findOne({
					userId: referer._id,
					activityDate: {
						$gte: moment(order_date).startOf('month').toDate(),
						$lt: moment(order_date).endOf('month').toDate()
					}
				});
				if (!monthlySpend || !monthlySpend.amount || monthlySpend.amount < activityPrice) {
					console.log('getReferralUsers ~~~~ push to ref search next~~~ id:',referer.id);
					await getReferralUsers(order_date, referer._id, maxDepth, activityPrice, currentDepth, referers, processed);
				} else {
					console.log('getReferralUsers ~~~~ push to ref from another month~~~ id:',referer.id);
					referers.add(referer); // Add the valid referer to the set
					await getReferralUsers(order_date, referer._id, maxDepth, activityPrice, currentDepth + 1, referers, processed);
				}
			}
			return Array.from(referers);
		};
		for (const order of orders) {
			const {masterAccount, giftAccount, activityPrice} = order.marketing;
			const marketing_depth = masterAccount.length || 0;
			const totalMarketingPrice = order.marketing.totalMarketingPrice;
			const user = await User.findById(order.customer); // получаем пользователя, сделавшего заказ
			console.log('~PROC ORDER~ totalPrice:', order.price, 'costumer:', user.id);
			let referers=[];
			const {referralLink} = user;
			if (user._id === referralLink) {
				console.error('Ошибка: пользователь ссылается на самого себя _id:',user._id,'заказ',order._id);
				continue; // переходим к следующему заказу
			}
			const giftErned = order.price * (giftAccount / 100);
			user.giftAccount += giftErned;
			await user.save();
			const giftErnedT = new Transaction({
				sender: user._id,
				recipient: user._id,
				type: 'giftErned',
				amount: giftErned
			});
			await giftErnedT.save();
			// Сохраняем транзакцию
			const referer = await User.findById(referralLink);
			const orderCreatedAt = order.createdAt;
			const orderMonth = moment(orderCreatedAt).month();
			const orderYear = moment(orderCreatedAt).year();
			if(referer){
				// начисление на подарочный счет рефереру
				if(
					referer.monthly_spend &&  referer.monthly_spend.activityDate &&
					referer.monthly_spend.activityDate.getMonth() === orderMonth &&
					referer.monthly_spend.activityDate.getFullYear() === orderYear &&
					referer.monthly_spend.amount >= activityPrice){
					console.log('Больше чем ценна активности', referer.monthly_spend.amount,activityPrice);
					referer.giftAccount += giftErned;
					await referer.save();
					const refGiftErnedT = new Transaction({
						sender: user._id,
						recipient: referer._id,
						type: 'giftErned',
						amount: giftErned
					});
					await refGiftErnedT.save();
				}else{
					// Ищем сведения о активности в месяце заказа
					const other_monthly_spend = await MonthlySpend.findOne({
						userId: referer._id,
						activityDate: {
							$gte: moment(orderCreatedAt).startOf('month').toDate(),
							$lt: moment(orderCreatedAt).endOf('month').toDate()
						}
					});
					if(other_monthly_spend&&other_monthly_spend.amount >= activityPrice){
						console.log('Больше чем ценна активности НО В ДРУГОМ МЕСЯЦЕ Т.К заказ другого', other_monthly_spend.amount,activityPrice);
						referer.giftAccount += giftErned;
						await referer.save();
						const refGiftErnedT = new Transaction({
							sender: user._id,
							recipient: referer._id,
							type: 'giftErned',
							amount: giftErned
						});
						await refGiftErnedT.save();
					}else{
						console.warn('referer id:',referer.id,'не начисленно на подарочный счет ввиду недостаточной активности');
					}
				}
				let compressedRefs = await getReferralUsers(orderCreatedAt, user._id, marketing_depth, activityPrice);
				const lengthToProcess = Math.min(compressedRefs.length, masterAccount.length);
				console.log('compressedRefs LENGTH', compressedRefs.length,'lengthToProcess',lengthToProcess);
				for (let i = 0; i < lengthToProcess; i++) {  
					const refererUser = await User.findById(compressedRefs[i]._id);
					if (refererUser) {
						const earned = totalMarketingPrice * (masterAccount[i].percent / 100);
						refererUser.cashAccount += earned*(80/100);	
						refererUser.cashTransfiguration += earned*(10/100);	
						refererUser.cashBusinessTools += earned*(10/100);
						console.log('начисляем бабки но 20% идет на афшоры', refererUser.id, earned);
						await refererUser.save();
						const refCashErnedT = new Transaction({
							order: order._id,
							sender: user._id,
							recipient: refererUser._id,
							type: 'cashErned',
							amount: earned
						});
						await refCashErnedT.save();		
						referers.push({earned, _id:refererUser._id, id:refererUser.id});
					}
				}
			}else{
				console.warn('Отсутсвует реферал у пользователя id',user.id);
			}
			let currentOrder = await Order.findById(order._id);
			currentOrder.isProcessed = true; // помечаем заказ как обработанный
			currentOrder.processed={
				referers,
				proccessedAt: moment().toDate()
			};
			await currentOrder.save();
			completedSteps++;
			// Вычисление процента выполнения задачи
			const percentCompleted = Math.floor((completedSteps / orders.length) * 100);
			console.log(`Задача processReferralPayments выполнена на ${percentCompleted}%`);
		}
		const end = new Date().getTime();
		console.log(`~~~end processReferralPayments: ${end - start}ms~~~~`);
	}catch(err){
		console.error('~~~~~~~~~~~~~~~~processReferralPayments ERROR~~~~~~~~~~~~~~~~~~~~~~~~~', err);
	}
};
process.on('SIGINT', function () {
	dayJob.cancel();
	schedule.gracefulShutdown()
		.then(() => process.exit(0));
});

export default {
	dayJob,
	updateMonthlySpend,
	processReferralPayments
};