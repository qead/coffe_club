const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.use('/createTodo', async(req,res)=>{
	try {
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

router.use('/getUser', async(req,res)=>{
	try {
		let id = req.body.id || jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		console.log('id', id);
		let user = await User.findOne({_id:id},{__v:0, password:0}).lean();
		console.log('user', user);
		res.json(user);
		// res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});	

router.use('/getRefs', async(req,res)=>{
	try {
		let id = req.body.id || jwt.verify(req.cookies.token,process.env.jwtSecret).userId;
		let users = await User.find({referralLink:id},{__v:0, password:0, referralLink:0}).lean();
		console.log('user', users);
		res.json(users);
		// res.end();
	} catch (error) {
		console.log('error', error);
		res.status(500).end('Что-то пошло не так');
	}
});	

module.exports = router;