/*********************************************************
 * 部屋に関連するDBアクセス処理
 *********************************************************/


var app = require('../../app');
var Chat = require('./chat').Chat;
var CONST = require('../const').CONST;
var utils = require('../utils');


function Chatroom() {
  this.client = app.set('mySqlClient');
}


//新着順で部屋一覧を取得する処理
Chatroom.find = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status,'+
    ' cr.owner_id, cr.member, c.title AS category,'+
    ' u.name AS owner, u.image AS ownerimage,'+
    ' CONCAT("/users/", u.id) AS ownerpage,'+
    ' u.`delete` AS isOwnerInactive'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
    ' WHERE cr.status != ? AND cr.`delete` = false'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [CONST.STATUS_OPEN, limit, offset],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};


//最新の書き込みとともに部屋一覧を取得する処理
//トップページ用
Chatroom.findWithLatestChat = function(params, next) {
  Chatroom.find(params, function(err, chatrooms) {
    if (err) { return next(err); }
    var size = chatrooms.length;
    var count = 0;
    if (size) {
      chatrooms.forEach(function(chatroom) {
        Chat.findLatest({
          chatroomId: chatroom.id,
          ownerId: chatroom.owner_id
        }, function(err2, chat) {
          if (err2) { return next(err2); }
          if (chat) {
            chatroom.latest = chat;
            chatroom.latest.message = utils.nl2br(utils.escHtml(chat.message));
          }
          count++;
          if (count >= size) {
            return next(null, chatrooms);
          }
        });
      });
    }
    else {
      return next(null, []);
    }
  });
};

//部屋の詳細情報を取得する処理
Chatroom.findOneById = function(id, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  client.query(
    'SELECT cr.id, cr.title, cr.description,'+
    ' cr.owner_id AS ownerId, cr.member, '+
    ' cr.status, cr.public, c.title AS category,'+
    ' DATE_FORMAT(cr.created_at, "%Y年%m月%d日 %k:%i") AS date,'+
    ' u.name AS owner, u.image AS ownerimage,'+
    ' CONCAT("/users/", u.id) AS ownerpage,'+
    ' u.`delete` AS isOwnerInactive'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
    ' WHERE cr.id = ? AND cr.`delete` = false',
    [id],
    function(err, results) {
      if (err) { return next(err); }
      if (results.length > 0) {
        return next(null, results[0]);
      }
      else {
        return next(null, null);
      }
    }
  );
};

//該当ユーザーがオーナーをしている部屋一覧の取得処理
Chatroom.findOwnerRoom = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var ownerId = params.ownerId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status,'+
    ' cr.member, c.title AS category,'+
    ' u.name AS owner, u.image AS ownerimage,'+
    ' CONCAT("/users/", u.id) AS ownerpage,'+
    ' u.`delete` AS isOwnerInactive'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
    ' WHERE cr.`delete` = false'+
    ' AND cr.owner_id = ?'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [ownerId, limit, offset],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};


//該当ユーザーが申請中の部屋一覧の取得処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.findEntryRoom = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT DISTINCT cr.id, cr.title, cr.description, cr.status,'+
    ' cr.member, c.title AS category,'+
    ' u.name AS owner, u.image AS ownerimage,'+
    ' CONCAT("/users/", u.id) AS ownerpage,'+
    ' u.`delete` AS isOwnerInactive'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN chats ch ON cr.id = ch.chatroom_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
    ' WHERE cr.`delete` = false AND ch.`delete` = false'+
    ' AND ch.status = 0'+
    ' AND ch.user_id = ? AND ch.invited = false'+
    ' AND cr.owner_id <> ?'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [userId, userId, limit, offset],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//該当ユーザーが参加中の部屋一覧の取得処理
//ユーザーの発言のある部屋を取得する
Chatroom.findJoinRoom = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT DISTINCT cr.id, cr.title, cr.description, cr.status,'+
    ' cr.member, c.title AS category,'+
    ' u.name AS owner, u.image AS ownerimage,'+
    ' CONCAT("/users/", u.id) AS ownerpage,'+
    ' u.`delete` AS isOwnerInactive'+
    ' FROM chats ch'+
    ' LEFT JOIN chatrooms cr ON ch.chatroom_id = cr.id'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
    ' WHERE cr.`delete` = false'+
    ' AND ch.user_id = ? AND ch.`delete` = false'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [userId, limit, offset],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};


//部屋に参加中のユーザー一覧を取得する処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.findMembers = function(id, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  client.query(
    'SELECT u.id AS userId, u.name AS userName'+
    ' FROM user_chatroom_relation ucr'+
    ' LEFT JOIN users u ON u.id = ucr.user_id'+
    ' WHERE ucr.chatroom_id = ? AND u.`delete` = false'+
    ' ORDER BY ucr.created_at ASC',
    [id],
    function(err, results) {
      if (err) { return next(err); }
      return next(null, results);
    }
  );
};

//部屋に参加中のユーザー一覧とともに部屋の詳細情報を取得する処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.findWithMembers = function(id, next) {
  var logger = app.set('logger');
  Chatroom.findOneById(id, function(err, chatroom) {
    if (err) { return next(err); }
    if (chatroom) {
      Chatroom.findMembers(id, function(err2, members) {
        if (err2) { return next(err2); }
        chatroom.members = members ? members : [];
        return next(null, chatroom);
      });
    }
    else {
      return next(null, null);
    }
  });
};


//部屋を新規作成する処理
Chatroom.create = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var categoryId = params.categoryId;
  var title = params.title;
  var description = params.description;
  var publicYN = params.publicYN;
  var ownerId = params.ownerId;

  client.query(
    'INSERT INTO chatrooms ('+
    ' category_id, title, description, owner_id,'+
    ' status, public, created_at'+
    ') VALUES ('+
    '?, ?, ?, ?, ?, ?, NOW()'+
    ')',
    [categoryId, title, description, ownerId, CONST.STATUS_OPEN_AND_INVITE, publicYN],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//部屋の参加者にユーザーを追加する処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.addMember = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var memberId = params.memberId;
  var chatroomId = params.chatroomId;

  client.query(
    'UPDATE chatrooms SET '+
    ' member = member + 1 '+
    ' WHERE id = ?',
    [chatroomId],
    function(err, results) {
      if (err) { return next(err);}

      client.query(
        'INSERT INTO user_chatroom_relation'+
        ' VALUES(?, ?, NOW())',
        [memberId, chatroomId],
        function(err2, results2) {
          if (err2) { return next(err2);}
          return next(null, results2);
        }
      );
    }
  );
};

//部屋のステータスを更新する処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.updateStatus = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var status = params.status;

  client.query(
    'UPDATE chatrooms SET'+
    ' status = ? WHERE id = ?',
    [status, chatroomId],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//部屋の削除を実行する処理
Chatroom.delete = function(chatroomId, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'UPDATE chatrooms SET'+
    ' `delete` = true'+
    ' WHERE id = ?',
    [chatroomId],
    function(err, results) {
      if (err) { return next(err);}
      return next(null);
    }
  );
};

//ユーザーの参加申請を承認する処理
//(参加申請機能が無くなった為現在は未使用)
Chatroom.invite = function(params, next) {
  var logger = app.set('logger');
  var chatId = params.chatId;
  var memberId = params.memberId;
  var chatroomId = params.chatroomId;

  Chat.updateInvitation({
    chatId: chatId
  }, function(err, result) {
    if (err) { return next(err);}

    Chatroom.updateStatus({
      chatroomId: chatroomId,
      status: CONST.STATUS_OPEN_AND_INVITE
    }, function(err2, result2) {
      if (err2) { return next(err2);}

      Chatroom.findMembers(chatroomId, function(err3, members) {
        if (err3) { return next(err3);}
        var exists = false;

        members.forEach(function(member) {
          if (member.userId == memberId) {
            exists = true;
            return false;
          }
        });

        if (!exists) {
          Chatroom.addMember(params, function(err4, result4) {
            if (err4) { return next(err4);}
            return next(err, result4);
          });
        }
        else {
          return next(null, null);
        }
      });
    });
  });
};

exports.Chatroom = Chatroom;
