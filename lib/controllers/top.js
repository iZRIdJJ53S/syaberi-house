var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res) {
  Chatroom.find({
    status: CONST.STATUS_INVITE
  }, function(err, chatrooms) {
    res.render('top', {
      meta_title: 'TOP',
      chatrooms: chatrooms
    });
  });
};
