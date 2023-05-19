const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const schema = new Schema({	
	_id: String,
	next: {type: Number, default: 1}
});
schema.statics.increment = function (counter, callback) {
	return this.findByIdAndUpdate({_id:counter}, { $inc: { next: 1 } }, {new: true, upsert: true, select: {next: 1}}, callback);
};
module.exports=mongoose.models.Counters || model('Counters', schema);