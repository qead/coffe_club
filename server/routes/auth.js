const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = Router();
const day = 86400; //seconds in 1 day
const mounth = 2592000; //seconds in 1 mounth
const User = require('../models/User');
const Counters = require('../models/Counters');
const jwtValidator = require('../utils/jwtValidator');
// const getNextSequenceValue = require('../utils/getNextSequenceValue');
import transporter from '../utils/nodemailer';
// api/auth
router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail()
		// check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		console.group('Процесс регистрации, ref id',req.body.id);
		try {
			let errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации'
				});
			}
			const { email, name, surname, birthDate, id, country, city, tel } = req.body;
			let lowerEmail = email.toLowerCase();
			const candidate = await User.findOne({ email:lowerEmail });
			if (candidate) {
				return res.status(400).json({ type: 'warning', message: 'Такой пользователь уже существует' });
			}
			const referral = await User.findOne({id:Number(id)});
			if (!referral) {
				console.log('Попытка регистрация с несущетсвующимм рефералом', id);
				return res.status(400).json({ type: 'warning', message: 'Укажите корректный id реферала'});
			}
			let password = '123456';
			let hashedPass = await bcrypt.hash(password, 5);
			let {next} = await Counters.increment('user_id');
			let user = await new User({ id: next, email: lowerEmail, name, surname, birthDate, password: hashedPass, referralLink:referral._id, country, city, tel });
			if(process.env.NODE_ENV == 'production'){
				await transporter.sendMail({
					from: '"Клуб любителей кофе! clubofcoffe.shop" <coffe_club@bk.ru>',
					to: lowerEmail,
					subject: 'Поздравляем с регистрацией!',
					html: 'Благодарим за участие в нашем проекте! Данные для входа на наш <a href="https://clubofcoffe.shop" target="_blank">сайт</a>: <br> <ul><li>Логин (id): '+next+'</li><li>Пароль: '+password+'</li>'
				});
			}
			await user.save();
			res.json({ type: 'success', message: 'Пользователь успешно зарегистирован' });
		} catch (err) {
			console.log('err:', err);
			res.status(500).json({ type: 'error', message: 'Что-то пошло не так' });
			// res.status(500).end('Что-то пошло не так');
		}
		console.groupEnd();
	});

router.post(
	'/login',
	[
		// check('email', 'Некорректный email').normalizeEmail().isEmail(),
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
			const { id, password, remember } = req.body;
			// let lowerEmail = email.toLowerCase();
			const user = await User.findOne({ id }).lean();
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
			console.log(`Пользователь ${id}, успешно авторизирован`);
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