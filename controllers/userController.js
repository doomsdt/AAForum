
var User = require('../models/users.js');

//Register new account.
exports.signIn = function(req,res){
	new User(req.body).save();
}
//--------------------

//Get user information by their id.
exports.read = function(req,res){
	User.find({userID:req.params.id},'userID',function(err,docs){
		res.status(200).json(docs[0]);
	});
}
//---------------------------------

//Get user information with correct ID/PW
exports.login = function(req,res){
	User.find({userID:req.params.id, password:req.body.password},'userID',function(err,docs){
		if(docs[0]){
			res.status(200).json(docs[0]);
		}
		else{
			res.status(204).send("failed");
		};
	});
}
//---------------------------------------