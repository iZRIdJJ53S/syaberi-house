/******************************************************************
 * syaberi-houseアプリケーションの起点となる起動スクリプト。
 * 開発環境やCPUのコア数が1個の場合はapp.jsを実行する。
 * ※複数のCPUのコアを活用する場合はapp.jsを直接使用せずcluster.jsを実行する。
 *
 * usage: $ node app.js
 ******************************************************************/

var fs = require('fs');
var path = require('path'); // dirname, basename とかのutil
var config = require('config');  // 設定ファイル
var express = require('express');
var app = module.exports = express();
var httpServer = require('http').createServer(app);
var httpsServer = require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, config.server.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, config.server.ssl.cert))
  }, app);
var io = require('socket.io').listen(httpsServer);
var st = require('st'); // 静的ファイルを配信/キャッシュモジュール
var mysql = require('mysql');
var passport = require('passport');  // authentication
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
// 複数ページにまたがる場合のエラーメッセージ等の一時的保管
// 出力したら消えてくれる
var flash = require('connect-flash');
var log4js  = require('log4js'); // ログ出力モジュール
var stackTrace = require('stack-trace'); // エラーobjectの追跡とか
var emailjs  = require('emailjs/email');
var cookieLib = require('cookie'); // cookie 操作npmモジュール
// セッションをRedisに保持
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore({
  host: config.redis.host,
  port: config.redis.port,
  db: 1,
  prefix: 'session:'
});
app.set('sessionStore', sessionStore);
// マルチプロセス/サーバー間でSocket.IOのセッションをRedisを使って共有する
var redis = require('socket.io/node_modules/redis');
var SocketIoRedisStore = require('socket.io/lib/stores/redis');
var ioPub = redis.createClient(config.redis.port, config.redis.host);
var ioSub = redis.createClient(config.redis.port, config.redis.host);
var ioStore = redis.createClient(config.redis.port, config.redis.host);


var middleware = require('./lib/middleware'); // sessionData
var utils = require('./lib/utils'); // original util

/************ コントローラー ***********/
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
    cookie: {
      maxAge: config.server.cookieMaxAge,
      secure: true
    },
    store: sessionStore
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  // SSL通信を強制
  app.use(middleware.ssl);
  // セッションデータをejsからアクセスできるように設定
  app.use(middleware.sessionData);
  // 環境変数をejsからアクセスできるように設定
  app.use(middleware.envData);
  // 設定ファイルをejsからアクセスできるように設定
  app.use(middleware.configData);
  app.use(express.compress());
  app.use(express.csrf()); // この位置じゃないと動かない？順番要注意
  // 静的ファイルの配信設定
  app.use(express.static(path.join(__dirname, 'public')));
  // app.routerを設定すると、通信の実行までに必要なマッピング処理を省略できる
  // ルーティングの機能を提供する。これはExpressでの拡張
  app.use(app.router);
  // エラー処理をハンドリングするミドルウェア
  app.use(middleware.notFound);
  app.use(middleware.unauthorized);
  app.use(middleware.error);
});


// developmentというモードでサーバを起動すると有効になる設定を作成
app.configure('development', function() {
  // 以下のexpress.errorHandlerはConnectの実装そのもの。
  // 詳しくは -> http://www.senchalabs.org/connect/errorHandler.html
  // 例外はDumpして、StackTraceも出す
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  logger.setLevel('INFO');
});

// testというモードでサーバを起動すると有効になる設定を作成
app.configure('test', function(){
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
    callbackURL: 'https://'+config.server.host+'/auth/twitter/callback'
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

/************ /MySQL ************/

/************ Mail Server ************/
var mailServer  = emailjs.server.connect({
   host: config.mail.host,
   ssl: true,
   user: config.mail.user,
   password: config.mail.password,
});
app.set('mailServer', mailServer);
/************ /Mail Server ************/



/************ Routing ************/

app.get ('/', topController.index);

app.get ('/chatrooms',           chatroomController.index);
app.get ('/chatrooms/new',       csrf, authenticated, chatroomController.new);
app.post('/chatrooms',           authenticated, chatroomController.create);
//参加申請は一時コメントアウト
//app.get ('/chatrooms/:id',       chatroomController.show);
app.get ('/chatrooms/:id',       function(req, res) { res.redirect(req.path+'/open') });
app.get ('/chatrooms/:id/open',   csrf, chatroomController.show);
app.get ('/chatrooms/:id/edit',   authenticated, chatroomController.edit);
app.get ('/chatrooms/:id/confirm_delete', csrf, authenticated, chatroomController.confirm_delete);
app.post('/chatrooms/:id/delete', authenticated, chatroomController.delete);
app.put ('/chatrooms/:id',        authenticated, chatroomController.update);
app.del ('/chatrooms/:id',        authenticated, chatroomController.destroy);
app.post('/chatrooms/:id/invite', authenticated, chatroomController.invite);

app.post('/chats',     authenticated, chatController.create);
app.del ('/chats/:id', authenticated, chatController.destroy);

app.get ('/mypage',    csrf, authenticated, mypageController.show);

app.get ('/users/new', csrf, authenticated, userController.new);
app.post('/users',     authenticated, userController.create);
app.get ('/users/:id', csrf, mypageController.show);

app.get ('/confirm_deactivation', csrf, authenticated, mypageController.confirmDeactivation);
app.post ('/deactivation', authenticated, mypageController.deactivation);

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

app.get('/terms', function(req, res) { res.render('terms', {}); });

app.get('*', function (req, res, next) {
  return next(new utils.NotFound(req.url));
});


//ログインチェック
function authenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return next(new utils.Unauthorized(req.url));
  }
}

//CSRF対策用トークンを設定
function csrf(req, res, next) {
  res.locals._csrf = req.session._csrf;
  next();
}

/************ /Routing ************/


/************ サーバ起動 ************/

httpServer.listen(config.server.port, function() {
  console.log('listening on port ' + config.server.port);
  console.log('host: ' + config.server.host);
});

httpsServer.listen(config.server.ssl.port, function() {
  console.log('listening on port ' + config.server.ssl.port);
  console.log('host: ' + config.server.host);
});

/************ /サーバ起動 ************/


/************ Socket.IO ************/

io.configure(function() {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 1);
  io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
  io.set('store', new SocketIoRedisStore({
    redisPub: ioPub,
    redisSub: ioSub,
    redisClient: ioStore
  }));
  io.sockets.on('connection', socketIoController.onConnection);
  io.sockets.on('disconnect', socketIoController.onDisconnect);

  /**************
  RedisStoreを使っているときにauthorizationの中でconnectionを設定しようとすると、断続的に接続できない現象が起きている。
  そのため、認証フェーズでconnectionの設定やネームスペースの作成、セッションの共有を行うのを取り止めることにする(本来はここでやるべき)。
  ***************/

  // io.set('authorization', function(handshake, callback) {
    // logger.info('##socket.io authorization');

    // var chatroomId = handshake.query.id;
    // var isUrlOpen = handshake.query.urlopen;
    // var namespace;
    // if (isUrlOpen) {
      // namespace = '/chatrooms/'+chatroomId+'/open';
    // }
    // else {
      // namespace = '/chatrooms/'+chatroomId;
    // }

    // if (!io.namespaces.hasOwnProperty(namespace)) {
      // var chatroom = io.of(namespace);
      // // ioConnect の確定
      // chatroom.on('connection', socketIoController.onConnection);
    // }

    // // ExpressとSocket.io間でセッションを共有
    // if (handshake.headers.cookie) {
      // var cookie = handshake.headers.cookie;
      // var sessionId = cookieLib.parse(cookie)['sess_id'];
      // sessionId = sessionId.split(':')[1].split('.')[0];

      // sessionStore.get(sessionId, function(err, session) {
        // if (err) {
          // callback(err.message, false);
        // }
        // else {
          // handshake.session = session;
        // }
      // });
    // }

    // callback(null, true);
  // });
});
app.set('io', io);

/************ /Socket.IO ************/

// プログラム全体での例外処理
process.on('uncaughtException', function(err) {
  var trace = stackTrace.parse(err);
  logger.error("uncaught exception: %s\n%s%", err, JSON.stringify(trace));
  //process.exit(1);
});
