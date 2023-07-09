const mongoose = require('mongoose');

const monthlySpendSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	amount: {
		type: Number,
		required: true
	},
	marketing_amount: {
		type: Number,
		required: true
	},
	activityDate: {
		type: Date,
		required: true
	}
});

const MonthlySpend = mongoose.models.MonthlySpend || mongoose.model('MonthlySpend', monthlySpendSchema);

module.exports = MonthlySpend;