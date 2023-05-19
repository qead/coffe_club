const jwtValidator = require('../utils/jwtValidator');
const isAdmin = require('../utils/isAdmin');
const logger = require('./logger');
const auth = require('./auth');
const profile = require('./profile');
const admin = require('./admin');
const user = require('./user');
const shop = require('./shop');

module.exports = function(app) {
	app.use('/', logger);
	app.use('/api/auth', auth);
	app.use('/api/profile', jwtValidator, profile);
	app.use('/api/admin', isAdmin, admin);
	app.use('/api/user', user);
	app.use('/api/products/', shop);
};