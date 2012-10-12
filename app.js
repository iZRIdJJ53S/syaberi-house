var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('config');
var topController = require('./lib/controllers/top');
var chatRoomController = require('./lib/controllers/chatRoom');
var chatController = require('./lib/controllers/chat');
var authController = require('./lib/controllers/auth');
var socketIoController = require('./lib/controllers/socketIo');


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
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

passport.use(new LocalStrategy(authController.authenticate));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findOne(id, function (err, user) {
    // done(err, user);
  // });
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
//app.get ('/chats/:id',      chatController.show);
app.del ('/chats/:id',      chatController.destroy);

app.get ('/register', authController.new);
app.post('/register', authController.create);
app.post('/login',    passport.authenticate('local', {
                        successRedirect: '/',
                        failureRedirect: '/login',
                        failureFlash: true
                      }));
app.get ('/logout',   authController.logout);


/************ /Routing ************/

server.listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});
io.sockets.on('connection', socketIoController.onConnection);


process.on('uncaughtException', function(err) {
  console.log('uncaught exception: %s', err);
  process.exit(1);
});
