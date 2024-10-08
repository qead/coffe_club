const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const SiteConfig = require('../models/SiteConfig');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const {processReferralPayments} = require('../utils/marketing');

router.use('/getUnProcessedOrders', async(req,res)=>{
	try {
		let result = await Order.countDocuments({isProcessed:false}).lean();
		console.log('getUnProcessedOrders result', result);
		res.json(result);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.post('/getOrders', async (req, res) => {
	try {
		const { page = 1 } = req.body;
		const perPage = 10;
		const skip = (page - 1) * perPage;
		// Получаем последние заказы с помощью skip и limit
		const orders = await Order.find({})
			.sort({ createdAt: -1 }) // Сортируем по убыванию даты создания (последние заказы первыми)
			.skip(skip)
			.limit(perPage)
			.lean(); // Используем метод lean() для получения простых объектов JSON, а не Mongoose документов
		const count = await Order.countDocuments().lean();
		res.json({orders,count});
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).end('Что-то пошло не так');
	}
});
router.post('/getOrderMark', async (req, res) => {
	try {
		const { id } = req.body;
		if(!id){
			res.status(400).end('Отсутствует id');
		}
		// Получаем последние заказы с помощью skip и limit
		const marketing = await Order.findOne({_id:id},{processed:1});
		res.json(marketing);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).end('Что-то пошло не так');
	}
});
router.use('/processReferralPayments', async(req,res)=>{
	try {
		let result = await processReferralPayments();
		console.log('result', result);
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

// router.use('/getMarketing', async(req,res)=>{
// 	try {
// 		let doc = await SiteConfig.findOne({}, {_id:0,__v: 0}).sort({_id:-1});
// 		res.json(doc);
// 	} catch (error) {
// 		console.log('error', error);
// 		res.status(500).end('Что-то пошло не так');
// 	}
// });

router.use('/editMarketing', async(req,res)=>{
	try {
		let {
			masterAccount,
			giftAccount,
			activityPrice,
			subscriptionPrice
		} = req.body;
		if(!masterAccount || !masterAccount.map || subscriptionPrice<=0){
			return res.status(400).end('Отсутствует массив процентов');
		}
		let insertDoc = masterAccount.map(item=>{return {'percent':item.percent};});
		let doc = await new SiteConfig({masterAccount:insertDoc,giftAccount,activityPrice,subscriptionPrice});
		doc.save();
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/editProduct', check('url','Некоректный url').isLength({ min: 5 }), async(req,res)=>{
	try {
		let {
			url
		} = req.body;
		let insertDoc = req.body;
		delete insertDoc.url;
		await Product.updateOne({url}, insertDoc);
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.post('/updateOrderStatus', async(req,res)=>{
	try {
		let { id, status } = req.body;
		// Validate the 'status' against the possibleStatuses array to ensure it's a valid status
		const possibleStatuses = ['Заказ создан', 'Передан', 'Отменен'];
		if (!possibleStatuses.includes(status)) {
			return res.status(400).end('Неизвестный статус');
		}
		// Update the order status using the provided ID
		await Order.updateOne({ _id: id }, { status });
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/addProduct', check('url','Некоректный url').isLength({ min: 5 }), async(req,res)=>{
	try {
		let {
			url,
			title,
			description,
			marketing_price,
			price,
			image,
			weight,
			meta_title,
			meta_description,
			isOff,
			isSale
			
		} = req.body;
		console.log('req.body', req.body);
		if(!url){
			return res.status(400).end('Отсутствует url');
		}
		let product = await new Product({
			url,
			image,
			title,
			description,
			price,
			meta_title,
			marketing_price,
			meta_description,
			isOff,
			weight,
			isSale
		});
		await product.save();
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});


router.use('/getOrdersCount', async(req,res)=>{
	try {
		let users = await User.count();
		res.json(users);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/getUsersCount', async(req,res)=>{
	try {
		let users = await User.count();
		res.json(users);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

module.exports = router;