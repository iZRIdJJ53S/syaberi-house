var app = require('../../app');
var config = require('config');
var Chat = require('../models/chat').Chat;
var Chatroom = require('../models/chatroom').Chatroom;
var Category = require('../models/category').Category;
var CONST = require('../const').CONST;
var utils = require('../utils');


exports.index = function(req, res, next) {
  var logger = app.set('logger');
  var profileId = req.query.profileId;
  var page = req.query.page || 1;
  var mode = req.query.mode;
  var num;
  if (mode === 'owner' || mode === 'entry' || mode === 'join') {
    num = CONST.MYPAGE_HOUSE_NUM;
  }
  else {
    num = CONST.TOP_HOUSE_NUM;
  }
  var offset = (page - 1) * num;

  //作成したハウス一覧
  if (mode === 'owner') {
    Chatroom.findOwnerRoom({
      ownerId: profileId,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //申請中のハウス一覧
  else if (mode === 'entry') {
    Chatroom.findEntryRoom({
      userId: req.user.id,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //参加中のハウス一覧
  else if (mode === 'join') {
    Chatroom.findJoinRoom({
      userId: req.user.id,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //全チャットルーム一覧
  else {
    Chatroom.findWithLatestChat({
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }

  function _indexNext(err, chatrooms) {
    if (err) { return next(err); }

    //表示件数より1件多く取得し、
    //その分が存在すればさらに次ページがあると判断する。
    var nextPage;
    if (chatrooms.length === num+1) {
      nextPage = parseInt(page, 10) + 1;
      //余分に取得した1件を削除
      chatrooms.splice(num, 1);
    }
    else {
      nextPage = 0;
    }

    return res.json({
      nextPage: nextPage,
      chatrooms: chatrooms
    });
  }
};




exports.new = function(req, res, next) {
  var logger = app.set('logger');
  Category.find(function(err, categories) {
    if (err) { return next(err); }
    res.render('createChatroom', {
      onetime_token: '',
      categories: categories
    });
  });
};

exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var categoryId = req.param('categoryId');
  var title = req.param('title');
  var description = req.param('description');
  var publicYN = req.param('publicYN');
  var userId = req.user.id;

  Chatroom.create({
    categoryId: categoryId,
    title: title,
    description: description,
    publicYN: publicYN,
    ownerId: userId
  }, function(err, result) {
    if (err) { return next(err); }
    var chatroomId = result.insertId;

    Chatroom.addMember({
      memberId: userId,
      chatroomId: chatroomId
    }, function(err2, result2) {
      if (err2) { return next(err); }
      res.send(200, {chatroomId: chatroomId});
    });
  });
};


exports.show = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.param('id');
  var userId = req.user ? req.user.id : null;
  var isUrlOpen = req.path.split('/')[3] === 'open'; //チャット開催中のURLか判定

  Chatroom.findWithMembers(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (!chatroom) {
      return next(new utils.NotFound(req.url));
      return;
    };

    //オーナー判定
    var isOwner = false;
    if (chatroom.ownerId === userId) {
      isOwner = true;
    }
    //チャット参加者判定
    //参加申請機能を無効にしているので全員をメンバー扱いにする
    var isMember = true;
    // var isMember = false;
    // chatroom.members.forEach(function(member) {
      // if (member.userId === userId) {
        // isMember = true;
        // return false;
      // }
    // });

    //募集中の場合は申し込みのチャットのみ表示
    if (chatroom.status !== CONST.STATUS_OPEN && !isUrlOpen) {
      chatStatus = CONST.STATUS_ENTRY;
    }
    //チャット開始中
    else if ((chatroom.status !== CONST.STATUS_INVITE) &&
             isUrlOpen) {
      //参照権限チェック
      //公開設定ならログインしていなくても参照可
      //非公開設定ならオーナーと参加者以外は不可
      if (chatroom.public != 1 &&
          (!req.isAuthenticated() || (!isOwner && !isMember))) {
        res.send(401, 'このページにはアクセスできません');
        return;
      }
      chatStatus = CONST.STATUS_CHAT;
    }
    else {
      chatStatus = CONST.STATUS_CHAT;
    }

    Chat.find({
      chatroomId: chatroomId,
      status: chatStatus,
      ownerId: chatroom.ownerId,
      loginId: userId
    }, function(err, chats) {
      if (err) { return next(err); }

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

      //URLでテンプレートファイルを切り替え
      var template = isUrlOpen ? 'chatroom' : 'lounge';

      res.render(template, {
        host: config.server.host,
        chatroom: chatroom,
        alreadyDone: alreadyDone,
        isOwner: isOwner,
        isMember: isMember,
        isUrlOpen: isUrlOpen,
        house_image: '',
        dec_image: '',
        onetime_token: '',
        chats: chats
      });
    });
  });

};

exports.invite = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.params.id;
  var ownerId = req.user.id;
  var memberId = req.param('member');
  var chatId = req.param('chat');

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (chatroom.ownerId === ownerId) {
      Chatroom.invite({
        chatroomId: chatroomId,
        ownerId: ownerId,
        memberId: memberId,
        chatId: chatId
      }, function(err2, result) {
        if (err2) { return next(err2); }
        res.send(200, {chatroomId: chatroomId});
      });
    }
    else {
      res.send(400, 'チャットルームの登録に失敗しました');
    }
  });
};

