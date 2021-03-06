var mongoose = require('mongoose');

var dbURI = "mongodb://user:aaf123@ds023654.mlab.com:23654/heroku_qb72gbhx";

exports.connect = function(){

	mongoose.connect(dbURI);
	mongoose.connection.on('connected', function(){
		console.log('Succeed to get connection pool' + dbURI);
	});

	mongoose.connection.on('error', function(err){
		console.log('Failed to get connection in mongoose, err is ' + err);
	});

	mongoose.connection.on('disconnected', function(){
		console.log('Database connection has disconnected.');
	});

	process.on('SIGINT', function(){
		mongoose.connection.close(function() {
			console.log('Application process is going down, disconnect database connection...');
			process.exit(0);
		});
	});

};