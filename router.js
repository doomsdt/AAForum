
var forum = require('./controllers/forumController.js');
var user = require('./controllers/userController.js');

exports.route = function(app){
	
	app.get('/',function(req,res){
		res.redirect('/main.html');
		res.end();
	});
		
	app.get('/forums', forum.list);
	
	app.post('/forums', forum.create);

	app.get('/forums/:id.:format', forum.read);
	
	app.get('/forums/:id', function(req,res){
		res.sendfile('./public/forum.html');
		
	});
		
	
	app.put('/forums/:id', forum.comment);
	
	app.delete('/forums/:id', function(req,res){
		
	});
	
	app.post('/users', user.signIn);
	
	app.get('/users/:id', user.read);
	
	app.post('/users/:id', user.login);
	
};