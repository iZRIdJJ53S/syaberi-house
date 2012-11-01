var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res, next) {
  var logger = app.set('logger');

  res.render('mypage', {
    fr_sup_list: []
  });
};
