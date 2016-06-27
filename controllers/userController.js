/**
 * http://usejsdoc.org/
 */
var User = require('../models/users.js');

exports.signIn = function(req,res){
	new User({
		userID:req.body.userID,
		password:req.body.password,
		watching:req.body.watching
	}).save();
}

exports.read = function(req,res){
	User.find({userID:req.params.id},'userID',function(err,docs){
		res.status(200).json(docs[0]);
	});
}

exports.login = function(req,res){
	User.find({userID:req.params.id, password:req.body.password},'userID',function(err,docs){
		if(docs[0]){
			res.status(200).json(docs[0]);
		}
		else{
			res.status(204).send("failed");
		};
		//if(req.body.password == docs[0])
		//res.status(200).json(docs[0]);
	});
}