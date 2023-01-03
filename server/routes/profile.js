const { Router } = require('express');
const router = Router();
// const Todo = require('../models/Todo');

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
	
module.exports = router;