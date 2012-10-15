var config = require('config');
var session = require('passport').session;
var Chat = require('../models/chat').Chat;

exports.show = function(req, res) {
  var chatroomId = req.param('id');

  var chat = new Chat();

  chat.list({chatroomId: chatroomId}, function(chats) {
    var userId, userName;

    res.render('chatroom', {
      meta_title: 'Chat',
      host: config.server.host,
      chatroomId: chatroomId,
      isAuth: session.isAuth,
      userId: session.userId,
      userName: session.userName,
      house_id: 1,
      house_name: 'テストチャット',
      house_image: '',
      house_status: 1,
      url_id: '',
      dec_image: '',
      house_desc: '',
      user_image: '',
      is_owner: false,
      onetime_token: '',
      is_mailsend: false,
      chats: chats
    });
  });

};
