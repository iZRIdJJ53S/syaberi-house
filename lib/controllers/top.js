var Chatroom = require('../models/chatroom').Chatroom;

exports.index = function(req, res) {
  Chatroom.find(function(err, chatrooms) {
    res.render('top', {
      meta_title: 'TOP',
      chatrooms: chatrooms
    });
  });
};
