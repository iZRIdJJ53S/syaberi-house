var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var flash = require('connect-flash');

var config = require('config');
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
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
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

app.get ('/chatrooms/new',      chatroomController.new);
app.post('/chatrooms',          chatroomController.create);
app.get ('/chatrooms/:id',      chatroomController.show);
app.get ('/chatrooms/:id/edit', chatroomController.edit);
app.put ('/chatrooms/:id',      chatroomController.update);
app.del ('/chatrooms/:id',      chatroomController.destroy);

app.post('/chats',          chatController.create);
//app.get ('/chats/:id',      chatController.show);
app.del ('/chats/:id',      chatController.destroy);

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

app.get('/auth/twitter',
  passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // メールアドレスが未登録の場合は入力画面へ
    if (!req.user.email) {
      res.redirect('/users/new');
    }
    else {
      var returnUrl = req.cookies.returnUrl;
      console.log(returnUrl);
      res.redirect(returnUrl);
    }
  });

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
