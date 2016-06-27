/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	userID : String,
	password : String,
	watching : [String],
});

module.exports = mongoose.model('User', userSchema);