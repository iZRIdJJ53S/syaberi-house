var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var flash = require('connect-flash');

var config = require('config');
var middleware = require('./lib/middleware');
var topController = require('./lib/controllers/top');
var chatroomController = require('./lib/controllers/chatroom');
var chatController = require('./lib/controllers/chat');
var userController = require('./lib/controllers/user');
var socketIoController = require('./lib/controllers/socketIo');
var uploadController = require('./lib/controllers/upload');

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
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.sessionData);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.locals({
  nl2br: function(str) { /** return str.replace(/\n/g, '<br/>') **/ return str }
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, userController.authenticate));

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: 'http://'+config.server.host+'/auth/twitter/callback'
  },
  userController.authenticateByTwitter
));

passport.serializeUser(userController.serializeUser);
passport.deserializeUser(userController.deserializeUser);


/************ Routing ************/

app.get ('/', topController.index);

app.get ('/chatrooms/new',      authenticated, chatroomController.new);
app.post('/chatrooms',          authenticated, chatroomController.create);
app.get ('/chatrooms/:id',      chatroomController.show);
app.get ('/chatrooms/:id/edit', authenticated, chatroomController.edit);
app.put ('/chatrooms/:id',      authenticated, chatroomController.update);
app.del ('/chatrooms/:id',      authenticated, chatroomController.destroy);

app.post('/chats',     authenticated, chatController.create);
app.del ('/chats/:id', authenticated, chatController.destroy);

app.get ('/users/new', authenticated, userController.new);
app.post('/users',     authenticated, userController.create);
app.put ('/users/:id', authenticated, userController.update);
app.del ('/users/:id', authenticated, userController.destroy);
app.get ('/login',     userController.login);
app.post('/login',     passport.authenticate('local', {
                         successRedirect: '/',
                         failureRedirect: '/login',
                         failureFlash: true
                       }));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
                                    failureRedirect: '/'
                                  }),
                                  userController.twitterCallback);

app.get ('/logout',    userController.logout);

app.post('/upload', uploadController.upload);

function authenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

/************ /Routing ************/




server.listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});

io.configure(function() {
  io.set('authorization', function(handshake, callback) {
    var chatroomId = handshake.query.id;
    if (!io.namespaces.hasOwnProperty('/chatrooms/'+chatroomId)) {
      var chatroom = io.of('/chatrooms/'+chatroomId);
      chatroom.on('connection', socketIoController.onConnection);
    }
    callback(null, true);
  });
});

process.on('uncaughtException', function(err) {
  console.log('uncaught exception: %s', err);
  process.exit(1);
});
