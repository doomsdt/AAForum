/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var forumSchema = new Schema({
	number : Number,
	title : String,
	contents : String,
	hostID : String,
	hostName : String,
	sDateTime : String,
	eDateTime : String,
	comments : [new Schema({
		body : String,
		commentor : String,
		postedOn : String
	},{_id:false})],
});

module.exports = mongoose.model('Forum', forumSchema);