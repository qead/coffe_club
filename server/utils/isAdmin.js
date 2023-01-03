const jwt = require('jsonwebtoken');
const User = require( '../models/User');
module.exports = isAdmin =async(req, res, next)=> {
	try {
		if(!req.cookies||!req.cookies.token){
			console.error('Попытка получения доступа к контенту авторизированных пользователей');
			throw new Error();
		}
		let decoded = jwt.verify(req.cookies.token, process.env.jwtSecret);
		if(!decoded||!decoded.userId){
			throw new Error('Неудалось получить id пользователя из JWT');
		}
		let {role} = await User.findById(decoded.userId).lean();
		if(role!='admin'){
			throw new Error('Пользователь не является админестратором');
		}
		return next();
	} catch (error) {
		console.log('isAdmin ERROR', error);
		return res.status(401).end('Доступ запрещен, пройдите авторизацию.');
	}
};