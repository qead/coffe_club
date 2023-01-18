const { Router } = require('express');
const router = Router();
const ObjectId =  require('mongoose').Types.ObjectId;

const Service = require('../models/Service');
const User = require('../models/User');


router.use('/getServices', async(req,res)=>{
	try {
		let services = await Service.find({},{__v:0,_id:0}).lean();
		console.log('services', services);
		res.json(services);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

router.use('/getReferral', async(req,res)=>{
	try {
		let {id} = req.body;
		if(!id || !ObjectId.isValid(id)){
			return res.status(400).json({ type: 'warning', message: 'Измените реферальную ссылку' });
		}
		let referral = await User.findOne({_id:id},{_id:0, name:1, surname:1}).lean();
		res.json(referral);
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});

module.exports = router;