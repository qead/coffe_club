const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Service = require('../models/Service');

router.use('/editService', async(req,res)=>{
	try {
		let {
			url
		} = req.body;
		let insertDoc = req.body;
		delete insertDoc.url;
		console.log('insertDoc', insertDoc);
		await Service.updateOne({url}, insertDoc, {upsert:true});
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/addService', async(req,res)=>{
	try {
		console.log('req.body',req.body);
		let {
			topic,
			image,
			url,
			title,
			description,
			price,
			meta_title,
			meta_description
			
		} = req.body;
		if(!url){
			return res.status(400).end('Отсутствует url');
		}
		let service = await new Service({
			topic,
			image: image.thumbUrl,
			url,
			title,
			description,
			price,
			meta_title,
			meta_description
		});
		await service.save();
		res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});


router.use('/getUsers', async(req,res)=>{
	try {
		let users = await User.find({});
		res.json(users);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

module.exports = router;