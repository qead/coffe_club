const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Order = require('../models/Order');
const SiteConfig = require('../models/SiteConfig');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {updateMonthlySpend} = require('../utils/marketing');
const moment = require('moment');

router.use('/getMonthSpend', async(req,res)=>{
	try {
		const userId = req.jwt.userId;
		if(!userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const ObjectId  =  mongoose.Types.ObjectId(userId);
		const [result] = await Order.aggregate([
			{
				$match: {
					customer: ObjectId,
					createdAt: {
						$gte: moment().startOf('month').toDate(),
						$lte: moment().endOf('month').toDate()
					}
				}
			},
			{
				$group: {
					_id: null,
					totalPrice: { $sum: '$price' }
				}
			}]);
			
		const {activityPrice} = await SiteConfig.findOne({},{id:0,__v:0}).sort({_id:-1});
		let amount = 0;
		if(result&&result.totalPrice){
			amount=result.totalPrice;
		}
		res.json({amount,activityPrice});
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});
router.post('/getTransactions', async(req,res)=>{
	try {
		const userId = req.jwt.userId;
		if(!userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		let filters = {};
		const { skip = 0, dateRange, transactionType } = req.body;
		const limit = 10;
		if (dateRange.length == 2) {
			filters.date = { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) };
		} 
		// else if (fromDate) {
		// 	filters.date = { $gte: new Date(fromDate) };
		// } else if (toDate) {
		// 	filters.date = { $lte: new Date(toDate) };
		// }
		if (transactionType) {
			filters.type = transactionType;
		}
		const cashGiftFilter = {
			$and: [
				{ type: { $in: ['cashErned', 'giftErned'] } },
				{ recipient: userId }
			]
		};
		const transferPurchaseFilter = {
			$or: [
				{ type: 'transfer', recipient: userId },
				{ type: 'transfer', sender: userId },
				{ type: 'subscription', sender: userId },
				{ type: 'purchase', sender: userId }
			]
		};
		filters = Object.assign(filters, {$or: [cashGiftFilter, transferPurchaseFilter] });
		let transactions = await Transaction.find(filters,{sender:0,recipient:0}).skip(parseInt(skip)).limit(parseInt(limit)).sort({_id:-1});
		let count = await Transaction.countDocuments(filters);
		res.json({transactions, count});
	} catch (error) {
		res.status(500).end('Что-то пошло не так');
	}
});
router.post('/getTransactionInfo', async(req,res)=>{
	try {
		const userId = req.jwt.userId;
		if(!userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const { _id } = req.body;
		if(!_id){
			return res.status(400).json({ type: 'error', message: 'Отсутвует номер транзакции' });
		}
		const cashGiftFilter = {
			$and: [
				{ type: { $in: ['cashErned', 'giftErned'] } },
				{ recipient: userId }
			]
		};
		const transferFilter = {
			$or: [
				{ type: 'transfer', recipient: userId },
				{ type: 'transfer', sender: userId },
				{ type: 'subscription', sender: userId }
			]
		};
		const filters = Object.assign({_id}, {$or: [cashGiftFilter, transferFilter] });
		const transaction = await Transaction.findOne(filters);
		if(!transaction){
			return res.status(404).json({ type: 'error', message: 'Не удалось найти транзакцию' });
		}
		if(transaction.type !== 'cashErned' && transaction.type !== 'giftErned' && transaction.type !== 'transfer' && transaction.type !== 'subscription'){
			return res.status(400).json({ type: 'error', message: 'Неизвестный тип транзакции' });
		}
		let sender, recipient;
		if (userId == transaction.sender&&transaction.sender.toString()) {
			sender = 'От Вас';
			recipient = await User.findById(transaction.recipient, { name: 1, surname: 1, id: 1, _id: 0 });
		}
		if (userId == transaction.recipient&&transaction.recipient.toString()) {
			recipient = 'Вам';
			sender = await User.findById(transaction.sender, { name: 1, surname: 1, id: 1, _id: 0 });
		}
		if(transaction.type=='subscription'){
			const user = await User.findById(userId,{lk_subscription:1});
			recipient='Дата окончания подписки:'+moment(user.lk_subscription).format('lll')||'Ошибка при получении даты';
		}
		res.json({ sender, recipient, type:transaction.type });
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});
router.use('/getOrders', async(req,res)=>{
	try {
		let filter = {};
		const userId = req.jwt.userId;
		if(!userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const {order} = req.body;
		if(order){
			filter._id=order;
		}
		let orders = await Order.find({$and:[filter,{customer:userId}]}).sort({_id:-1});
		res.json(orders);
	} catch (error) {
		res.status(500).end('Что-то пошло не так');
	}
});
router.use('/userAccountPayment', async(req,res)=>{
	try {
		let userId = mongoose.Types.ObjectId(req.jwt.userId);
		const user = await User.findById(userId,{cashAccount:1}); 
		if(!user){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const {subscriptionPrice} = await SiteConfig.findOne({},{id:0,__v:0}).sort({_id:-1});
		if(subscriptionPrice>user.cashAccount){
			return res.status(400).json({ type: 'error', message: 'Недостаточно средст для оплаты лк' });
		}
		user.cashAccount -= subscriptionPrice;
		const subscriptionDate = new Date();
		subscriptionDate.setFullYear(subscriptionDate.getFullYear() + 1);
		user.lk_subscription = subscriptionDate;
		await user.save();
		const transaction = new Transaction({
			sender: userId,
			amount: subscriptionPrice,
			type: 'subscription',
			date: new Date()
		});
		await transaction.save();
		res.end('Оплата подписки на год успешно прошла');
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});
router.use('/createOrder', async(req,res)=>{
	try {
		if(!req.jwt.userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		let customer = mongoose.Types.ObjectId(req.jwt.userId);
		const {masterAccount,giftAccount,activityPrice, subscriptionPrice} = await SiteConfig.findOne({},{id:0,__v:0}).sort({_id:-1});
		const user = await User.findById(customer,{cashAccount:1,lk_subscription:1}); 
		if(!user.lk_subscription || user.lk_subscription < new Date()){
			return res.status(403).json({ price:subscriptionPrice, message: 'Вы не оплатили личный кабинет для осуществления покупок'});
		}
		let {items} = req.body;
		// let delivery_address = {};
		// if(!address.map || !address.length){
		// 	return res.status(400).json({ type: 'error', message: 'Отсутсвует адресс доставки, заполните адрес доставки и повторите попытку' });
		// }
		// address.forEach(item => {
		// 	delivery_address[item.name]=item.value;
		// });
		const urls = items.map(i => i.url);
		const products = await Product.find({url:{$in:urls }},{_id: 1, url: 1, price:1, marketing_price:1});
		let totalPrice = 0;
		let totalMarketingPrice = 0;
		for (let j = 0; j < items.length; j++) {
			const reqUrl = items[j].url;
			for (let i = 0; i < products.length; i++) {
				const url = products[i].url;
				if(reqUrl == url){
					totalPrice += products[i].price*items[j].count;
					totalMarketingPrice += products[i].marketing_price*items[j].count;
					items[j].price = products[i].price;
					items[j]._id = products[i]._id;
				}
			}
		}
		// Проверяем, достаточно ли у пользователя средств для покупки товара
		if (!user.cashAccount||user.cashAccount < totalPrice) {
			// Возвращаем ошибку, если у пользователя недостаточно средств
			return res.status(400).json({ type: 'error', message: 'Недостаточно средств' });
		} else {
			// Списываем сумму товара со счета пользователя
			user.cashAccount -= totalPrice;
			// Создаем объект транзакции и сохраняем его в базе данных
			await user.save();
			if(!masterAccount || !masterAccount.length){
				res.status(400).json({ type: 'error', message: 'Отсутсвует данные для начисления процентов' });
			}
			await updateMonthlySpend(customer, totalPrice, totalMarketingPrice);
			console.log('customer', customer);
			let order = new Order({
				products: items,
				price:totalPrice,
				customer,
				marketing:{
					totalMarketingPrice,
					masterAccount,
					giftAccount,
					activityPrice
				}
			});
			await order.save();
			const transaction = new Transaction({
				order: order._id,
				sender: customer,
				amount: totalPrice,
				type: 'purchase',
				date: new Date()
			});
			await transaction.save();
			// Обновляем баланс и список транзакций пользователя
		}
		res.end('Ваш заказ успешно сформирован!');
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/getUser', async(req,res)=>{
	try {
		let id = jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		if(!id){			
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		let user = await User.findOne({_id:id},{__v:0, password:0}).lean();
		res.json(user);
		// res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});	
router.use('/getBalance', async(req,res)=>{
	try {
		let id = jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		if(!id){			
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		let user = await User.findById(id,{__v:0, password:0,id:0,email:0,name:0,surname:0,birthDate:0,referralLink:0,country:0,tel:0,role:0}).lean();
		res.json({cash:user.cashAccount||0,gift:user.giftAccount||0});
		// res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});	

router.use('/getRefs', async(req,res)=>{
	try {
		let id = jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		if(!id){			
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		let users = await User.find({referralLink:id},{__v:0, password:0, referralLink:0}).lean();
		res.json(users);
		// res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});	

router.post('/getTableRefs', async(req,res)=>{
	try {
		const userId = req.jwt.userId;
		if(!userId){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const getReferrals = async (referer, depth = 1, maxDepth = 10) => {
			if (depth > maxDepth) {
				return [];
			}
			// Получаем всех пользователей с реферером, равным referer
			const users = await User.find({ referralLink: referer }, { password: 0, cashAccount: 0, giftAccount: 0 });
			if (!users.length) {
				return [];
			}
			// Добавляем глубину пользователя
			const usersWithDepth = users.map((user) => ({ ...user.toObject(), depth }));
			// Рекурсивно вызываем getReferrals для каждого найденного пользователя
			const referrals = await Promise.all(
				users.map(async (user) => {
					const nextDepth = depth + 1;
					if (nextDepth <= maxDepth) {
						const nextReferrals = await getReferrals(user._id, nextDepth, maxDepth);
						return nextReferrals;
					} else {
						return [];
					}
				})
			);
			// Объединяем всех найденных пользователей и возвращаем
			return usersWithDepth.concat(...referrals);
		};
		const allReferrals = await getReferrals(userId);
		res.json(allReferrals);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.post('/getTableRefsv2', async(req,res)=>{
	try {
		const userId = req.jwt.userId;
		const USER_FILTER  =  { name: 1, surname: 1,tel:1,email:1, id: 1, monthly_spend:1 };
		const CURRENT_USER = await User.findById(userId,USER_FILTER);
		if(!CURRENT_USER){
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя' });
		}
		const getReferrals = async (referer, depth = 1, maxDepth = 10) => {
			if (depth > maxDepth) {
				return [];
			}
			const users = await User.find({ referralLink: referer }, USER_FILTER);
			if (!users.length) {
				return [];
			}
			const usersWithDepth = [];
			for (const user of users) {
				const referrals = await getReferrals(user._id, depth + 1, maxDepth);
		
				let group_amount = user.monthly_spend.amount;
				let group_marketing_amount = user.monthly_spend.marketing_amount;
		
				if (referrals.length > 0) {
					for (const referral of referrals) {
						group_amount += referral.group_amount;
						group_marketing_amount += referral.group_marketing_amount;
					}
				}
		
				const userWithChildren = {
					...user.toObject(),
					depth,
					group_amount,
					group_marketing_amount
				};
		
				if (referrals.length > 0) {
					userWithChildren.children = referrals;
				}
		
				usersWithDepth.push(userWithChildren);
			}
			return usersWithDepth;
		};
		const allReferrals = await getReferrals(userId);
		if(!CURRENT_USER.monthly_spend){
			CURRENT_USER.monthly_spend={
				amount:0,
				marketing_amount:0
			};
		}
		
		const groupAmount = allReferrals.reduce((total, referral) => {
			if (referral.depth === 1) {
				return total + referral.group_amount;
			}
			return total;
		}, 0);
	
		const groupMarketingAmount = allReferrals.reduce((total, referral) => {
			if (referral.depth === 1) {
				return total + referral.group_marketing_amount;
			}
			return total;
		}, 0); 
		allReferrals.unshift({
			...CURRENT_USER.toObject(),
			depth:0,
			group_amount: groupAmount+CURRENT_USER.monthly_spend.amount,
			group_marketing_amount:groupMarketingAmount+CURRENT_USER.monthly_spend.marketing_amount
		});
		res.json(allReferrals);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.post('/transfer-funds', async (req, res) => {
	try {
		const { recipientId, amount } = req.body;
		if(amount<=0){
			return res.status(400).json({ type: 'error', message: 'Слишком маленькая сумма для перевода'});
		}
		let id = jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		if(!id){					
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя'});
		}
		// Check if sender and recipient exist
		const sender = await User.findById(id);
		const recipient = await User.findOne({id:recipientId});
		if (!sender || !recipient) {		
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		if(sender.id==recipientId){
			return res.status(404).json({ message: 'Нельзя перевести валюту самому себе' });
		}
		// Check if sender has sufficient funds
		if (sender.cashAccount < amount) {		
			return res.status(400).json({ message: 'Недостаточно средств' });
		}
		// Update balances
		sender.cashAccount -= amount;
		recipient.cashAccount += amount;
		// Save updated user documents
		await sender.save();
		await recipient.save();
		// Создаем новый объект транзакции
		const transaction = new Transaction({
			sender: sender._id,
			recipient: recipient._id,
			type: 'transfer',
			amount
		});
		// Сохраняем транзакцию
		await transaction.save();
		return res.status(200).json({ message: 'Перевод успешно завершен' });
	} catch (err) {
		console.error(err);
		res.status(500).end('Что-то пошло не так');
	}
});

router.post('/getInfoFromUser', async (req, res) => {
	try {
		let id = jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		if(!id){					
			return res.status(400).json({ type: 'error', message: 'Не удалось определить пользователя'});
		}
		const { recipientId } = req.body;
		const recipient = await User.findOne({id:recipientId},{surname:1});
		if (!recipient) {		
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		return res.json(recipient.surname);
	} catch (err) {
		console.error(err);
		res.status(500).end('Что-то пошло не так');
	}
});
  
module.exports = router;