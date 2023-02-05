const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
	name:{type: String, required:true},
	surname:{type: String, required:true},
	tel:{type: String, required:true},
	country:{type: String, required:true},
	city:{type: String},
	email:{type: String, required:true, unique:true},
	id:{type:Number, required:true,  unique:true},
	password:{type: String, required:true},
	birthDate:{type: String, required:true},
	referralLink:{type:Types.ObjectId}
});

module.exports=model('User', schema);