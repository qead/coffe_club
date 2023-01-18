const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = Router();
const day = 86400; //seconds in 1 day
const mounth = 2592000; //seconds in 1 mounth
const User = require('../models/User');
const jwtValidator = require('../utils/jwtValidator');
// api/auth
router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		console.group('Процесс регистрации');
		try {
			let errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации'
				});
			}
			const { email, password, name, surname, birthDate, referralLink } = req.body;
			const candidate = await User.findOne({ email });
			if (candidate) {
				return res.status(400).json({ type: 'warning', message: 'Такой пользователь уже существует' });
			}
			const referral = await User.findOne({_id:referralLink});
			if (!referral) {
				console.log('Попытка регистрация с несущетсвующимм рефералом', referralLink);
				return res.status(400).json({ type: 'warning', message: 'Укажите корректный id реферала'});
			}
			let hashedPass = await bcrypt.hash(password, 5);
			let user = await new User({ email, name, surname, birthDate, password: hashedPass, referralLink });
			await user.save();
			res.json({ type: 'success', message: 'Пользователь успешно зарегистирован' });
		} catch (err) {
			console.log('err:', err);
			res.status(500).end('Что-то пошло не так');
		}
		console.groupEnd();
	});

router.post(
	'/login',
	[
		check('email', 'Некорректный email').normalizeEmail().isEmail(),
		check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		console.group('Процесс авторизации');
		try {
			let errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при входе в систему'
				});
			}
			const { email, password, remember } = req.body;
			const user = await User.findOne({ email }).lean();
			if (!user){
				return res.status(400).json({ type: 'warning', message: 'Не удалось войти, попробуйте изменить данные' });
			}
			let isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ type: 'warning', message: 'Не удалось войти, попробуйте изменить данные' });
			}
			// use key req.body.remember <--- TODO
			const token = jwt.sign(
				{ userId: user._id },
				process.env.jwtSecret,
				{ expiresIn: remember?mounth:day }
			);
			if(user.role==='admin'){
				res.cookie('isAdmin', true);
			}
			res.cookie('token', token, {maxAge:(remember?mounth:day)*1000/*, httpOnly: true, secure: true */}); //<-- TODO secure cookie
			console.log(`Пользователь ${email}, успешно авторизирован`);
			res.json({ type: 'success', message: 'Пользователь успешно авторизирован' });
		} catch (err) {
			console.log('err:', err);
			res.status(500).end('Что-то пошло не так');
		}
		console.groupEnd();
	});
router.use('/logout',async(req,res)=>{
	try {
		console.log('Пользователь успешно вышел из системы');
		res.clearCookie('token');
		res.end();
	} catch (error) {
		res.status(500).end('Что-то пошло не так');
	}
});
router.use('/isAuth',jwtValidator,async(req,res)=>{
	try {
		console.log('Авторизация прошла успешно');
		res.end();
	} catch (error) {
		res.status(500).end('Что-то пошло не так');
	}
});

module.exports = router;