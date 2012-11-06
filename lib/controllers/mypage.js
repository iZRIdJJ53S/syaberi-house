var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var User = require('../models/user').User;
var CONST = require('../const').CONST;
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
    res.render('mypage', {
      profile: profile,
      isMine: isMine
    });
  });

};
