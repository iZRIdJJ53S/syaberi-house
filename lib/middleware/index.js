/*************************************
 * 自作のConnectミドルウェア集
 *************************************/

var app = require('../../app');
var utils = require('../utils');
var config = require('config');


//SSL通信を強制するミドルウェア
exports.ssl = function(req, res, next) {
  if (!req.secure) {
    var host = config.server.host;
    var port = config.server.ssl.port;
    //ホスト名にポート番号が含まれる場合はドメイン名のみを切り出し
    if (host.indexOf(':') > -1) {
      host = host.split(':')[0];
    }
    if (process.env.NODE_ENV === 'production') {
      return res.redirect('https://'+host);
    }
    else {
      return res.redirect('https://'+host+':'+port+req.path);
    }
  }
  return next();
};


//セッションデータをejsからアクセスできるように設定
exports.sessionData = function(req, res, next) {
  var logger = app.set('logger');

  app.locals.isAuth = req.isAuthenticated();
  if (req.isAuthenticated()) {
    app.locals.userId = req.user.id;
    app.locals.userName = req.user.name;
    app.locals.userImage = req.user.image;
  }
  next();
};


//環境変数をejsからアクセスできるように設定
exports.envData = function(req, res, next) {
  var logger = app.set('logger');
  app.locals.env = app.settings.env;
  app.locals.isProduction = app.settings.env === 'production';
  next();
};


//設定ファイルをejsからアクセスできるように設定
exports.configData = function(req, res, next) {
  var logger = app.set('logger');
  app.locals.config = config;
  next();
};

//404 Not Foundをハンドリングするミドルウェア
exports.notFound = function(err, req, res, next) {
  var logger = app.set('logger');

  if (err instanceof utils.NotFound) {
    logger.warn('404 Page Not Found: '+err.path);
    err.type = 'notFound';
    return res.render('error', {
      status: 404, // status code 404 を設定
      title: '404 Page Not Found',
      err: err
    });
  }
  else {
    return next(err);
  }
};

//401 Unauthorizedをハンドリングするミドルウェア
exports.unauthorized = function(err, req, res, next) {
  var logger = app.set('logger');

  if (err instanceof utils.Unauthorized) {
    logger.warn('401 Unauthorized: '+err.path);
    err.type = 'unauthorized';
    return res.render('error', {
      status: 401, // status code 404 を設定
      title: '401 Unauthorized',
      err: err
    });
  }
  else {
    return next(err);
  }
};

//システムエラーなどその他のエラーをハンドリングするミドルウェア
exports.error = function(err, req, res, next) {
  var logger = app.set('logger');

  if (err) {
    logger.error(err);
    return res.render('error', {
      status: 500, // status code 500 を設定
      title: '500 Internal Server Error',
      err: err
    });
  }
  else {
    return next();
  }
};
