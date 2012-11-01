var app = require('../../app');
var logger = app.set('logger');
var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res) {
  res.render('mypage', {
    fr_sup_list: []
  });

};
