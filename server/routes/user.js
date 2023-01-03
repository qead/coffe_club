const { Router } = require('express');
const router = Router();

const Service = require('../models/Service');


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

module.exports = router;