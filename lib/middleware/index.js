var app = require('../../app');
var utils = require('../utils');
var config = require('config');


//SSL通信を強制
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

exports.envData = function(req, res, next) {
  var logger = app.set('logger');
  app.locals.env = app.settings.env;
  app.locals.isProduction = app.settings.env === 'production';
  next();
};

exports.configData = function(req, res, next) {
  var logger = app.set('logger');
  app.locals.config = config;
  next();
};

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
