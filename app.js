var express = require('express');
var http = require('http');
var path = require('path');

var config = require('config');
var topController = require('./lib/controllers/top');
var chatRoomController = require('./lib/controllers/chatRoom');
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


/************ Routing ************/

app.get ('/', topController.index);

app.get ('/chatrooms/new',      chatRoomController.new);
app.post('/chatrooms',          chatRoomController.create);
app.get ('/chatrooms/:id',      chatRoomController.show);
app.get ('/chatrooms/:id/edit', chatRoomController.edit);
app.put ('/chatrooms/:id',      chatRoomController.update);
app.del ('/chatrooms/:id',      chatRoomController.destroy);

app.post('/chats',          chatController.create);
app.get ('/chats/:id',      chatController.show);
app.del ('/chats/:id',      chatController.destroy);

/************ Routing ************/

http.createServer(app).listen(app.get('port'), function() {
  console.log("listening on port " + app.get('port'));
});


process.on('uncaughtException', function(err) {
  console.log('uncaught exception: %s', err);
  process.exit(1);
});
