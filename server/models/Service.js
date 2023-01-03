const {Schema, model} = require('mongoose');

const schema = new Schema({
	url:{type: String, required:true},
	topic:{type: String, required:true},
	price:{type: Number, required:true},
	title:{type: String, required:true},
	description:{type: String, required:true},
	meta_title:{type: String},
	meta_description:{type: String},
	image:{type: String},
	isOff:{type: Boolean}
});

module.exports=model('Service', schema);