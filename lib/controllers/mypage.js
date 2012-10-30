var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res) {
  res.render('mypage', {
    user_dec_list: [],
    fr_sup_list: [{}]
  });

};
