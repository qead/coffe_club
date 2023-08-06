const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const transactionSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['transfer', 'cashErned', 'purchase','gift_purchase', 'giftErned','subscription'],
		required: true
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	amount: {
		type: Number,
		required: true
	},
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order'
	},
	date: {
		type: Date,
		default: Date.now
	}
});
  

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;