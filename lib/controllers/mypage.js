var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.show = function(req, res, next) {
  var logger = app.set('logger');
  var profileId = req.param('id');

  //自分のプロフィールを参照時は/mypageにURLをリダイレクトさせる
  if (req.isAuthenticated &&
      profileId == req.user.id &&
      req.path !== '/mypage') {
    return res.redirect('/mypage');
  }

  res.render('mypage', {
    profileId: profileId,
    fr_sup_list: []
  });
};
