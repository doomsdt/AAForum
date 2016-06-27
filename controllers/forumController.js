/**
 * http://usejsdoc.org/
 */
var Forum = require('../models/forums.js');
var mongoose = require('mongoose');

var forumCnt = mongoose.model('forumCnt',{idx:Number});

exports.create = function(req,res){
	
	forumCnt.findOneAndUpdate(
			{id:'forumCnt'},
			{$inc:{idx:1}},
			{new:true}	
	,function(err,data){
		var forum = new Forum(req.body.forum);
		forum.number = data.idx;
		forum.save();
	});
	res.send("created");
}

exports.list = function(req,res){
	Forum.find({}).sort({sDateTime:-1}).exec(function(err, docs){
		res.status(200).json(docs);
	});
}

exports.read = function(req,res){
	Forum.find({number:req.params.id},function(err, docs){
		res.status(200).json(docs[0]);

	});
}

exports.comment = function(req,res){
	console.log(req.body.comment);
	Forum.update(
		{number:req.params.id},
		{$push:{comments : req.body.comment}},function(err){
			
		}
	);
}