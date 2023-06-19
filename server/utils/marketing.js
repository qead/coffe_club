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
	if (!user.monthly_spend) {
		// Если пользователь еще не совершал покупок, создаем для него объект monthly_spend с текущей датой
		user.monthly_spend = {
			amount: amount,
			marketing_amount: marketing_amount,
			date: currentDate
		};
		console.log('!user.monthly_spend', user.monthly_spend);
	} else {
		console.log('else');
		const currentMonth = moment().month();
		const currentYear = moment().year();
		const month = moment(user.monthly_spend.date).month();
		const year = moment(user.monthly_spend.date).year();
		if (month !== currentMonth || year !== currentYear) {
			console.log('month/year !== currentMonth/currentYear', month, currentMonth, year, currentYear);
			// Текущий месяц отличается от месяца в monthly_spend, сохраняем текущие значения в отдельную таблицу
			const monthlySpend = new MonthlySpend({
				userId: userId,
				amount: user.monthly_spend.amount,
				marketing_amount: user.monthly_spend.marketing_amount,
				date: currentDate
			});
			await monthlySpend.save();
			// Обнуляем monthly_spend
			user.monthly_spend = {
				amount: amount,
				marketing_amount: marketing_amount,
				date: currentDate
			};
		} else { 
			console.log('else 2', month, currentMonth, year, currentYear);
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
				date: currentDate
			});
			await monthlySpend.save();
			user.monthly_spend = {
				amount: 0,
				marketing_amount: 0,
				date: currentDate
			};
			await user.save();
		}
	}
});

export const processReferralPayments = async () => {
	try{
		const start = new Date().getTime();
		// await createBackup(User);
		console.log('!!!start processReferralPayments!!!', start);
		const orders = await Order.find({ isProcessed: false }).lean(); // получаем все необработанные заказы
		console.log('orders length', orders.length);
		let completedSteps=0;
		const getReferralUsers = async function (userId, maxDepth = 0, activityPrice = 0, currentDepth = 0, referers = []) {
			if (currentDepth >= maxDepth) {
				return referers;
			}
			const user = await User.findById(userId);
			console.log('getReferralUsers DEPTH', user.id, currentDepth, maxDepth);
			if (!user) {
				console.log('getReferralUsers ~~~~User not found~~~');
				throw new Error('User not found');
			}
			const {referralLink} = user;
			if (!referralLink) {
				console.log('!referralLink', referralLink);
				return referers;
			}
			const referer = await User.findById(referralLink).lean();
			if (!referer) {
				return referers;
			}
			console.log('referer id', referer.id);
			if(!referer.monthly_spend || !referer.monthly_spend.amount || referer.monthly_spend.amount < activityPrice){
				console.log('!referer.monthly_spend || !referer.monthly_spend.amount || referer.monthly_spend.amount < activityPrice', referer.monthly_spend,referer.monthly_spend.amount,activityPrice);
				await getReferralUsers(referer._id, maxDepth, activityPrice, currentDepth, referers);
			}else{
				console.log('push referer', referer);
				referers.push(referer);
				await getReferralUsers(referer._id, maxDepth, activityPrice, currentDepth + 1, referers);
			}
			return referers;
		};
		for (const order of orders) {
			const {masterAccount, giftAccount, activityPrice} = order.marketing;
			const marketing_depth = masterAccount.length;
			const totalMarketingPrice = order.marketing.totalMarketingPrice;
			const user = await User.findById(order.customer); // получаем пользователя, сделавшего заказ
			console.log('order totalPrice:', order.price, 'costumer:', user.id);
			let referers=[];
			const {referralLink} = user;
			if (user._id === referralLink) {
				console.error('Ошибка: пользователь ссылается на самого себя _id:',user._id,'заказ',order._id);
				continue; // переходим к следующему заказу
			}
			const referer = await User.findById(referralLink);
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
			if(referer){
				console.log('Есть реферал');
				// начисление на подарочный счет рефереру
				if(referer.monthly_spend && referer.monthly_spend.amount >= activityPrice){
					console.log('Больше чем ценна активности',referer.monthly_spend.amount,activityPrice);
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
				let compressedRefs = await getReferralUsers(user._id, marketing_depth, activityPrice);
				console.log('сукаа compressedRefs', compressedRefs);
				for (let i = 0; i < compressedRefs.length; i++) {
					const refererUser = await User.findById(compressedRefs[i]._id);
					const earned = totalMarketingPrice * (masterAccount[i].percent / 100);			
					refererUser.cashAccount += earned;	
					console.log('начисляем бабки', refererUser.id,earned);
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
		console.error('~~~~~~~~~~~~~~~~processReferralPayments~~~~~~~~~~~~~~~~~~~~~~~~~', err);
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