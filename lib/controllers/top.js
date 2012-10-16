var session = require('passport').session;
var Chatroom = require('../models/chatroom').Chatroom;

exports.index = function(req, res) {

  Chatroom.find(function(err, chatrooms) {
    res.render('top', {
      meta_title: 'TOP',
      isAuth: session.isAuth,
      userId: session.userId,
      userName: session.userName,
      chatrooms: chatrooms
    });
  });
};
