
var mongoose = require('mongoose');
var Forum = require('../models/forums.js');
var forumCnt = mongoose.model('forumCnt',{idx:Number});


//Creates new forum.
//Give auto-increment number to forum.
exports.create = function(req,res){C
	forumCnt.findOneAndUpdate(
			{id:'forumCnt'},
			{$inc:{idx:1}},
			{new:true}	
	,function(err,data){
		var forum = new Forum(req.body.forum);
		forum.number = data.idx;
		forum.save();
	});
}
//-----------------------------------

//Find all forums and return sorted.
exports.list = function(req,res){
	Forum.find({}).sort({sDateTime:-1}).exec(function(err, docs){
		res.status(200).json(docs);
	});
}
//---------------------------------

//Get a forum by their given number.
exports.read = function(req,res){
	Forum.find({number:req.params.id},function(err, docs){
		res.status(200).json(docs[0]);
	});
}
//---------------------------------

//Push comment to forum comments array.
exports.comment = function(req,res){
	Forum.update(
		{number:req.params.id},
		{$addToSet:{comments : req.body.comment}},function(err){
			console.log('Error')
		}
	);
}
//-------------------------------------