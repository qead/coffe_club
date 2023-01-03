const { Router } = require('express');
const router = Router();
router.use(async (req, res, next) => {
	try {
		console.log('new route to',req.url);
		next();
	} catch (error) {
		console.log('error:', error);
	}
});
module.exports = router;
