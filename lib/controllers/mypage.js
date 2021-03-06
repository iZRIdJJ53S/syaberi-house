/*********************************************************
 * マイページに関連するリクエストを扱うコントローラー
 *********************************************************/


var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var User = require('../models/user').User;
var CONST = require('../const').CONST;
var utils = require('../utils');
var Mail = require('../utils/mail').Mail;
var check  = require('validator').check;


//マイページ画面を表示
exports.show = function(req, res, next) {
  var logger = app.set('logger');
  var profileId = null;
  // なぜか、iphone(safari)でstring型のnullが飛んでくるので
  // string型のnull は無視するように修正
  if (req.param('id') && req.param('id') != 'null') {
    profileId = req.param('id');
  } else {
    profileId = req.user.id;
  }

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


//退会確認画面を表示
exports.confirmDeactivation = function(req, res, next) {
  var logger = app.set('logger');

  res.render('deactivation', {
  });
};

//退会実行処理
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
