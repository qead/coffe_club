const jwt = require('jsonwebtoken');
module.exports = jwtValidator=async(req, res, next)=> {
	try {
		if(!req.cookies||!req.cookies.token){
			console.error('Попытка получения доступа к контенту авторизированных пользователей');
			throw new Error();
		}
		req.jwt = jwt.verify(req.cookies.token, process.env.jwtSecret);
		return next();
	} catch (error) {
		return res.status(401).end('Доступ запрещен, пройдите авторизацию.');
	}
};