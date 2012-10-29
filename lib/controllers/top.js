var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res) {

  Chatroom.find({
    offset: 0,
    limit: CONST.TOP_HOUSE_NUM
  }, function(err, chatrooms) {
    res.render('top', {
      meta_title: 'TOP',
      chatrooms: chatrooms
    });
  });
};
