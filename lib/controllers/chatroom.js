var config = require('config');
var Chat = require('../models/chat').Chat;
var Chatroom = require('../models/chatroom').Chatroom;
var Category = require('../models/category').Category;
var CONST = require('../const').CONST;



exports.new = function(req, res) {
  Category.find(function(err, categories) {
    res.render('createChatroom', {
      onetime_token: '',
      categories: categories
    });
  });
};

exports.create = function(req, res) {
  var categoryId = req.param('categoryId');
  var title = req.param('title');
  var description = req.param('description');
  var userId = req.user.id;

  Chatroom.create({
    categoryId: categoryId,
    title: title,
    description: description,
    ownerId: userId
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
      res.send(400, '該当するチャットルームが存在しません');
      return;
    };
    if (chatroom.status == CONST.STATUS_ENTRY) {
      chatStatus = CONST.STATUS_ENTRY;
    }
    else if (chatroom.status == CONST.STATUS_OPEN) {
      //参照権限チェック
      if (!req.user ||
          (req.user.id != chatroom.ownerId &&
           req.user.id != chatroom.partnerId)) {
        res.send(401, 'このページにはアクセスできません');
        return;
      }
      chatStatus = CONST.STATUS_CHAT;
    }

    Chat.find({
      chatroomId: chatroomId,
      status: chatStatus
    }, function(err, chats) {
      //オーナー判定
      var isOwner = false;
      if (req.user && chatroom.ownerId == req.user.id) {
        isOwner = true;
      }

      //申込者が発言済かチェック
      var alreadyDone = false;
      chats.forEach(function(chat) {
        if (req.user &&
            !isOwner &&
            chat.user_id == req.user.id
           ) {
          alreadyDone = true;
          return false;
        }
      });

      res.render('chatroom', {
        host: config.server.host,
        chatroom: chatroom,
        alreadyDone: alreadyDone,
        isOwner: isOwner,
        house_image: '',
        dec_image: '',
        onetime_token: '',
        chats: chats
      });
    });
  });

};

exports.start = function(req, res) {
  var chatroomId = req.params.id;
  var ownerId = req.user.id;
  var partnerId = req.param('partner');

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { throw err }
    if (chatroom.ownerId == ownerId) {
      Chatroom.start({
        chatroomId: chatroomId,
        ownerId: ownerId,
        partnerId: partnerId
      }, function(err, result) {
        if (err) {
          res.send(400, 'チャットルームの登録に失敗しました');
        }
        res.send(200, {chatroomId: chatroomId});
      });
    }
    else {
      res.send(400, 'チャットルームの登録に失敗しました');
    }
  });
};

