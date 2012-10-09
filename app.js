var express = require('express');
var http = require('http');
var path = require('path');

var config = require('./config');
var topController = require('./lib/controllers/top');
var chatController = require('./lib/controllers/chat');

var app = express();

app.configure(function() {
  app.set('port', config.server.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.server.cookieSecret));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', topController.index);
app.get('/ch/:id', chatController.index);


http.createServer(app).listen(app.get('port'), function() {
  console.log("listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err) {
  console.log('uncaught exception: %s', err);
});
