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

router.use('/getMarketing', async(req,res)=>{
	try {
		let doc = await SiteConfig.findOne({}, {_id:0,__v: 0}).sort({_id:-1});
		res.json(doc);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

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