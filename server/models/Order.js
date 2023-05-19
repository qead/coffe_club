const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const CartItemSchema = new Schema({
	_id: {type: Schema.ObjectId, ref: 'Product'},
	price: String,
	url: String,
	count: Number
});
export const StatusSchema = {
	type: String,
	default: 'Заказ создан',
	enum: ['Заказ создан' , 'В обработке', 'Передано службе доставки', 'Заказ в пути', 'Доставлен', 'Отменен']
};
const schema = new Schema({
	products: [CartItemSchema],
	customer: {type: Schema.ObjectId, ref: 'User', require:true},
	giftCash_used:{type:Number},
	giftCash_earned:{type:Number},
	marketing:{
		masterAccount:[{percent:Number}],
		giftAccount:{type:Number, default:0},
		activityPrice:{type:Number, default:0},
		totalMarketingPrice:{type:Number, default:0,require:true}
	},
	processed:{
		referers: [{
			earned: {
				type: Number,
				required: true
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			id: {
				type: String,
				required: true
			}
		}],
		proccessedAt: Date
	},
	isProcessed:{type:Boolean, default: false},
	price: Number,
	status: StatusSchema
},
{
	timestamps: true
});
schema.index({ isProcessed: 1});
module.exports= mongoose.models.Order || model('Order', schema);