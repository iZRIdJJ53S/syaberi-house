var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var st = require('st'); // 静的ファイルを配信/キャッシュモジュール
var mysql = require('mysql');
var path = require('path'); // dirname, basename とかのutil
var passport = require('passport');  // authentication
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
// 複数ページにまたがる場合のエラーメッセージ等の一時的保管
// 出力したら消えてくれる
var flash = require('connect-flash');
var cookieLib = require('cookie');
var config = require('config');
var log4js  = require('log4js');
var stackTrace = require('stack-trace');
// セッションをRedisに保持
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore({
  host: config.redis.host,
  port: config.redis.port,
  db: 1,
  prefix: 'session:'
});
// マルチプロセス/サーバー間でSocket.IOのセッションをRedisを使って共有する
var redis = require('socket.io/node_modules/redis');
var SocketIoRedisStore = require('socket.io/lib/stores/redis');
var ioPub = redis.createClient(config.redis.port, config.redis.host);
var ioSub = redis.createClient(config.redis.port, config.redis.host);
var ioStore = redis.createClient(config.redis.port, config.redis.host);


var middleware = require('./lib/middleware'); // sessionData
var utils = require('./lib/utils'); // original util
var topController = require('./lib/controllers/top');
var chatroomController = require('./lib/controllers/chatroom');
var chatController = require('./lib/controllers/chat');
var mypageController = require('./lib/controllers/mypage');
var userController = require('./lib/controllers/user');
var socketIoController = require('./lib/controllers/socketIo');
var uploadController = require('./lib/controllers/upload');


/************ ロギング設定 ************/

var rotateSize = 2000000;
log4js.addAppender(require('log4js/lib/appenders/file').appender('logs/app.log'), '[sys]', rotateSize);
var logger = log4js.getLogger('[sys]');
app.set('logger', logger);

/************ /ロギング設定 ************/


app.configure(function() {
  app.set('port', config.server.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // 以下で設定するmethodOverrideは、Connectが提供している機能
  // hidden属性のinputタグを用いてPostメソッドの取り扱いを便利にする
  // この操作のため、<input type="hidden" name="_method" />は予約される
  // bodyParserを有効化（下記methodOverrideのために必要）
  app.use(express.bodyParser());
  // methodOverrideを有効化
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.server.cookieSecret));
  app.use(express.session({
    key: 'sess_id',
    cookie: { maxAge: config.server.cookieMaxAge },  // 1week
    store: sessionStore
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(middleware.sessionData);
  app.use(middleware.envData);
  // 静的ファイルの配信設定
  // ※404ページを表示させることができないのでstモジュールの利用一時停止
  // app.use(st({
    // path: path.join(__dirname, 'public'),
    // url: '/'
  // }));
  // app.routerを設定すると、通信の実行までに必要なマッピング処理を省略できる
  // ルーティングの機能を提供する。これはExpressでの拡張
  app.use(express.compress());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(middleware.notFound);
  app.use(middleware.error);
});


// developmentというモードでサーバを起動すると有効になる設定を作成
app.configure('development', function() {
  // 以下のexpress.errorHandlerはConnectの実装そのもの。
  // 詳しくは -> http://www.senchalabs.org/connect/errorHandler.html
  // 例外はDumpして、StackTraceも出す
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  logger.setLevel('TRACE');
});

// testというモードでサーバを起動すると有効になる設定を作成
app.configure('production', function(){
  logger.setLevel('TRACE');
});

// productionというモードでサーバを起動すると有効になる設定を作成
app.configure('production', function(){
  logger.setLevel('WARN');
});


// テンプレート内で使用する関数を設定
app.locals({
  esc: function(str) { return utils.nl2br(utils.escHtml(str)) }
});

// ログイン認証 ごく普通のID/PASS
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, userController.authenticate));

// ログイン認証 Twitter-OAuth
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: 'http://'+config.server.host+'/auth/twitter/callback'
  },
  userController.authenticateByTwitter
));

passport.serializeUser(userController.serializeUser);
passport.deserializeUser(userController.deserializeUser);


/************ MySQL ************/

var mySqlClient = mysql.createClient({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});
app.set('mySqlClient', mySqlClient);

/************ MySQL ************/


/************ Routing ************/

app.get ('/', topController.index);

app.get ('/chatrooms',           chatroomController.index);
app.get ('/chatrooms/new',       authenticated, chatroomController.new);
app.post('/chatrooms',           authenticated, chatroomController.create);
app.get ('/chatrooms/:id',       chatroomController.show);
app.get ('/chatrooms/:id/open',  authenticated, chatroomController.show);
app.get ('/chatrooms/:id/edit',  authenticated, chatroomController.edit);
app.put ('/chatrooms/:id',       authenticated, chatroomController.update);
app.del ('/chatrooms/:id',       authenticated, chatroomController.destroy);
app.post('/chatrooms/:id/invite', authenticated, chatroomController.invite);

app.post('/chats',     authenticated, chatController.create);
app.del ('/chats/:id', authenticated, chatController.destroy);

app.get ('/mypage', authenticated, mypageController.index);

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

app.get('*', function (req, res, next) {
  return next(new utils.NotFound(req.url));
});

function authenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

/************ /Routing ************/


server.listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});


/************ Socket.IO ************/

io.configure(function() {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 1);
  io.set('store', new SocketIoRedisStore({
    redisPub: ioPub,
    redisSub: ioSub,
    redisClient: ioStore
  }));

  io.set('authorization', function(handshake, callback) {
    var chatroomId = handshake.query.id;
    if (!io.namespaces.hasOwnProperty('/chatrooms/'+chatroomId)) {
      var chatroom = io.of('/chatrooms/'+chatroomId);
      // ioConnect の確定
      chatroom.on('connection', socketIoController.onConnection);
    }

    // ExpressとSocket.io間でセッションを共有
    if (handshake.headers.cookie) {
      var cookie = handshake.headers.cookie;
      var sessionId = cookieLib.parse(cookie)['sess_id'];
      sessionId = sessionId.split(':')[1].split('.')[0];

      sessionStore.get(sessionId, function(err, session) {
        if (err) {
          callback(err.message, false);
        }
        else {
          handshake.session = session;
        }
      });
    }

    callback(null, true);
  });
});

/************ /Socket.IO ************/

// プログラム全体での例外処理
process.on('uncaughtException', function(err) {
  var trace = stackTrace.parse(err);
  logger.error("uncaught exception: %s\n%s%", err, JSON.stringify(trace));
  //process.exit(1);
});
