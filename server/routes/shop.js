const { Router } = require('express');
const router = Router();
const Product = require('../models/Product');
const SiteConfig = require('../models/SiteConfig');
const jwt = require('jsonwebtoken');

router.use('/getProduct',
	async(req,res)=>{
		try {
			let {url} = req.body;
			if (!url) {
				return res.status(400).json({
					type: 'warning',
					message: 'Отсутствует обязательные параметры'
				});
			}
			let product = await  Product.findOne({url});
			res.json(product);
			// let {url,title,description,price } = req.body;
			// let todo = new Todo({
			// 	url,title,description,price
			// });
			// await todo.save();
			res.end();
		} catch (error) {
			console.log('error', error);
			res.status(500).end('Что-то пошло не так');
		}
	});
router.use('/getProducts',
	async(req,res)=>{
		try {
			let {urls} = req.body;
			let products = [];
			if (urls) {
				products = await Product.find( { url : { $in : urls } } );
				// return res.status(400).json({
				// 	type: 'warning',
				// 	message: 'Отсутствует обязательные параметры'
				// });
			}else{
				products = await Product.find({});
			}
			res.json(products);
			// let {url,title,description,price } = req.body;
			// let todo = new Todo({
			// 	url,title,description,price
			// });
			// await todo.save();
			res.end();
		} catch (error) {
			console.log('error', error);
			res.status(500).end('Что-то пошло не так');
		}
	}
);

router.use('/getMarketing', async(req,res)=>{
	try {
		let doc = await SiteConfig.findOne({}, {_id:0,__v: 0}).sort({_id:-1});
		res.json(doc);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});


module.exports = router;