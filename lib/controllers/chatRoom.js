var config = require('config');
var Chat = require('../models/chat').Chat;

exports.show = function(req, res) {
  var chatroomId = req.param('id');

  var chat = new Chat();

  chat.list({chatroomId: chatroomId}, function(chats) {
    console.log(require('util').inspect(chats[0]));
    res.render('chatroom', {
      meta_title: 'Chat',
      host: config.server.host,
      is_auth_login: true,
      house_id: 1,
      house_name: 'テスト',
      house_image: '',
      house_status: 1,
      url_id: '',
      dec_image: '',
      house_desc: '',
      user_id: 10,
      user_name: 'テスト太郎',
      user_image: '',
      is_owner: false,
      is_supporter: false,
      onetime_token: '',
      is_mailsend: false,
      chats: chats
    });
  });

};
