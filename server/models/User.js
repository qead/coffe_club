const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const schema = new Schema({
	name:{type: String, required:true},
	surname:{type: String, required:true},
	tel:{type: String, required:true},
	country:{type: String, required:true},
	city:{type: String},
	email:{type: String, required:true, unique:true},
	id:{type:Number, required:true, unique:true},
	password:{type: String, required:true},
	birthDate:{type: String, required:true},
	referralLink:{type:Types.ObjectId, require:true},
	cashTransfiguration:{type:Number, default: 0},
	cashBusinessTools:{type:Number, default: 0},
	cashAccount:{type:Number, default: 0},
	monthly_spend:{
		amount: {type:Number, default: 0},
		marketing_amount: {type:Number, default: 0},
		date: {type:Date}
	},
	giftAccount:{type:Number, default: 0},
	lk_subscription: {type: Date}
});
schema.index({ referralLink: 1});
module.exports=mongoose.models.User || model('User', schema);