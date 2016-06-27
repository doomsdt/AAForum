
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/page', express.static(__dirname + '/node_modules/angular-utils-pagination')); 

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


require('./router.js').route(app);
require('./db.js').connect();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
