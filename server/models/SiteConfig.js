const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

// const Percent = new Schema({
// 	percent: Number
// });

const schema = new Schema({
	masterAccount: [{percent:Number}],
	giftAccount: Number,
	activityPrice:Number,
	subscriptionPrice:Number
});

module.exports=mongoose.models.SiteConfig || model('SiteConfig', schema);