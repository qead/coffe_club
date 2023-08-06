const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const schema = new Schema({
	url:{type: String, required:true, default:'https://via.placeholder.com/300x150'},
	title:{type: String, required:true},
	description: { type: Schema.Types.Mixed, required: true }, 
	price:{type: Number, required:true},
	marketing_price:{type: Number, required:true,default:0},
	image:{type: String},
	meta_title:{type: String},
	meta_description:{type: String},
	isOff:{type: Boolean},
	weight:{type:Number,default:0},
	isSale:{type: Boolean}
});

module.exports=mongoose.models.Product || model('Product', schema);