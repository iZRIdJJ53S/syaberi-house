var app = require('../../app');
var CONST = require('../const').CONST;

function Chat() {
  this.client = app.set('mySqlClient');
}

Chat.find = function(params, next) {
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var status = params.status;
  var ownerId = params.ownerId;
  var loginId = params.loginId;

  var data;
  var query = 'SELECT c.id, c.message, c.user_id, c.invited,'+
    ' u.name AS username, u.image AS userimage,'+
    ' DATE_FORMAT(c.created_at, "%Y-%c-%d %k:%i:%s") AS time'+
    ' FROM chats c'+
    ' LEFT JOIN users u ON u.id = c.user_id'+
    ' WHERE c.chatroom_id = ? AND c.status = ? '+
    ' AND c.`delete` = false';

  //自分以外の申込者のチャットは見えないように絞り込み
  //オーナーは全部表示
  if (status === CONST.STATUS_ENTRY &&
      ownerId != loginId) {
    query += ' AND (c.user_id = ? OR c.user_id = ?)';
    data = [chatroomId, status, ownerId, loginId];
  }
  else {
    data = [chatroomId, status];
  }
  query += ' ORDER BY c.created_at ASC';

  client.query(query, data, function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chat.findOneById = function(id, next) {
  var client = app.set('mySqlClient');
  client.query(
    'SELECT id, user_id AS userId, message'+
    ' FROM chats'+
    ' WHERE id = ? AND `delete` = false',
    [id],
    function(err, results) {
      if (err) { next(err); }
      if (results.length > 0) {
        next(null, results[0]);
      }
      else {
        next(null, null);
      }
    }
  );
};

Chat.create = function(params, next) {
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var userId = params.userId;
  var message = params.message;
  var type = params.type;
  var status = params.status;

  client.query(
    'INSERT INTO chats ('+
    ' chatroom_id, user_id, message, type, status, created_at'+
    ') VALUES ('+
    '  ?, ?, ?, ?, ?, NOW()'+
    ')',
    [chatroomId, userId, message, type, status],
    function(err, results) {
      if (err) { next(err); }

      client.query(
        'SELECT id,'+
        ' DATE_FORMAT(created_at, "%Y-%c-%d %k:%i:%s") AS time'+
        ' FROM chats'+
        ' WHERE id = LAST_INSERT_ID()',
        function(err2, results2) {
          if (err2) { next(err2); }
          next(null, results2);
        }
      );
    }
  );
};

Chat.updateInvitation = function(params, next) {
  var client = app.set('mySqlClient');
  var chatId = params.chatId;

  client.query(
    'UPDATE chats'+
    ' SET `invited` = true'+
    ' WHERE id = ?',
    [chatId],
    function(err, results) {
      if (err) { next(err); }
      next(null, results);
    }
  );
};


Chat.destroy = function(params, next) {
  var client = app.set('mySqlClient');
  var chatId = params.chatId;

  client.query(
    'UPDATE chats'+
    ' SET `delete` = true'+
    ' WHERE id = ?',
    [chatId],
    function(err, results) {
      if (err) { next(err); }
      next(null, results);
    }
  );
};


exports.Chat = Chat;
