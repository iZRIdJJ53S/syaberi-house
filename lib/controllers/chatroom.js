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
  var userId = req.user ? req.user.id : null;
  var isUrlOpen = req.path.split('/')[3] === 'open'; //チャット開催中のURLか判定

  Chatroom.findWithMembers(chatroomId, function(err, chatroom) {
    if (err) { throw err }
    if (!chatroom) {
      res.send(400, '該当するチャットルームが存在しません');
      return;
    };

    //オーナー判定
    var isOwner = false;
    if (chatroom.ownerId === userId) {
      isOwner = true;
    }
    //チャット参加者判定
    var isMember = false;
    chatroom.members.forEach(function(member) {
      if (member.userId === userId) {
        isMember = true;
        return false;
      }
    });

    //募集中の場合は申し込みのチャットのみ表示
    if (chatroom.status !== CONST.STATUS_OPEN && !isUrlOpen) {
      chatStatus = CONST.STATUS_ENTRY;
    }
    //チャット開始中
    else if ((chatroom.status !== CONST.STATUS_INVITE) &&
             isUrlOpen) {
      //参照権限チェック
      //オーナーでも参加者でも無いユーザーは不可
      if (!req.isAuthenticated() || (!isOwner && !isMember)) {
        res.send(401, 'このページにはアクセスできません');
        return;
      }
      chatStatus = CONST.STATUS_CHAT;
    }
    else {
        res.send(401, 'このページにはアクセスできません');
        return;
    }

    Chat.find({
      chatroomId: chatroomId,
      status: chatStatus,
      ownerId: chatroom.ownerId,
      loginId: userId
    }, function(err, chats) {

      //申込者が発言済かチェック
      var alreadyDone = false;
      chats.forEach(function(chat) {
        if (req.user &&
            !isOwner &&
            chat.user_id === req.user.id
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
        isUrlOpen: isUrlOpen,
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
  var memberId = req.param('member');

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { throw err }
    if (chatroom.ownerId === ownerId) {
      Chatroom.start({
        chatroomId: chatroomId,
        ownerId: ownerId,
        memberId: memberId
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

