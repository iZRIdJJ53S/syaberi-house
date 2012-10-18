var config = require('config');
var Chat = require('../models/chat').Chat;
var Chatroom = require('../models/chatroom').Chatroom;
var Category = require('../models/category').Category;

exports.new = function(req, res) {
  Category.find(function(err, categories) {
    var params = {
      onetime_token: '',
      isAuth: req.isAuthenticated(),
      categories: categories
    };
    if (req.isAuthenticated()) {
      params.userId = req.user.id;
      params.userName = req.user.name;
      params.userImage = req.user.image;
    }

    res.render('createChatroom', params);
  });
};

exports.create = function(req, res) {
  var categoryId = req.param('categoryId');
  var title = req.param('title');
  var description = req.param('description');
  var userId = req.user.id;

  var chatroom = new Chatroom();
  chatroom.create({
    categoryId: categoryId,
    title: title,
    description: description,
    userId: userId
  }, function(err, result) {
    if (err) {
      res.send(400, 'チャットルームの登録に失敗しました');
    }
    var chatroomId = result.insertId;
    res.send(200, {chatroomId: chatroomId});
  });
};

exports.show = function(req, res) {
  var chatroomId = req.param('id');

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { throw err }
    if (!chatroom) {
      res.send(400, '該当するチャットルームが存在しません')
      return;
    };

    Chat.find({chatroomId: chatroomId}, function(err, chats) {
      var params = {
        meta_title: 'Chat',
        host: config.server.host,
        isAuth: req.isAuthenticated(),
        chatroomId: chatroomId,
        category: chatroom.category,
        title: chatroom.title,
        description: chatroom.description,
        chatroomStatus: chatroom.status,
        house_image: '',
        dec_image: '',
        is_owner: false,
        onetime_token: '',
        is_mailsend: false,
        chats: chats
      };
      if (req.isAuthenticated()) {
        params.userId = req.user.id;
        params.userName = req.user.name;
        params.userImage = req.user.image;
      }
      res.render('chatroom', params);
    });
  });


};
