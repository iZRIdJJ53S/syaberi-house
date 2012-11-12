var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var User = require('../models/user').User;
var CONST = require('../const').CONST;
var utils = require('../utils');
var Mail = require('../utils/mail').Mail;
var check  = require('validator').check;

exports.show = function(req, res, next) {
  var logger = app.set('logger');
  var profileId = req.param('id') || req.user.id;

  //validation
  try {
    check(profileId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  //本人のマイページか判定
  var isMine = req.isAuthenticated() && profileId == req.user.id;
  //自分のプロフィールを参照時は/mypageにURLをリダイレクトさせる
  if (isMine && req.path !== '/mypage') {
    return res.redirect('/mypage');
  }

  User.findOneById(profileId, function(err, profile) {
    if (!profile) {
      return next(new utils.NotFound(req.url));
    }

    res.render('mypage', {
      profile: profile,
      isMine: isMine
    });
  });

};

exports.confirmDeactivation = function(req, res, next) {
  var logger = app.set('logger');

  res.render('deactivation', {
  });
};

exports.deactivation = function(req, res, next) {
  var logger = app.set('logger');
  var _csrf = req.session._csrf;

  //CSRF Check
  if (_csrf !== req.param('_csrf')) {
    logger.error('CSRF Invalid');
    return next(new Error());
  }

  User.deactivate(req.user.id, function(err) {

    //メール通知
    var mail = new Mail();
    mail.sendDeactivationMail(req.user.name, req.user.email);

    //セッション破棄
    req.logout();

    res.json({}, 200);
  });
};
