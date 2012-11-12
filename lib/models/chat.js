/*********************************************************
 * チャットに関連するDBアクセス処理
 *********************************************************/


var app = require('../../app');
var CONST = require('../const').CONST;


function Chat() {
  this.client = app.set('mySqlClient');
}


//部屋に表示するチャット一覧取得処理
Chat.find = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var status = params.status;
  var ownerId = params.ownerId;
  var loginId = params.loginId;

  var data;
  var query = 'SELECT c.id, c.message, c.user_id, c.invited,'+
    ' u.name AS username, u.image AS userimage,'+
    ' CONCAT("/users/", u.id) AS userpage, '+
    ' u.`delete` AS isInactive, '+
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
      if (err) { return next(err); }
      return next(null, results);
    }
  );
};

//チャットをIDで検索する処理
Chat.findOneById = function(id, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  client.query(
    'SELECT id, user_id AS userId, message'+
    ' FROM chats'+
    ' WHERE id = ? AND `delete` = false',
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


//チャットルームの最新の発言を取得する処理
//ただしオーナーの発言は除く
//トップページの部屋一覧で使用
Chat.findLatest = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var ownerId = params.ownerId;

  client.query(
    'SELECT c.id, c.user_id AS userId, c.message,'+
    ' u.name AS username, u.image AS userimage,'+
    ' u.`delete` AS isInactive'+
    ' FROM chats c'+
    ' LEFT JOIN users u ON u.id = c.user_id'+
    ' WHERE c.chatroom_id = ? AND c.status <> 0'+
    ' AND c.user_id <> ?'+
    ' AND c.`delete` = false'+
    ' ORDER BY id DESC LIMIT 1',
    [chatroomId, ownerId],
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


//チャット登録処理
Chat.create = function(params, next) {
  var logger = app.set('logger');
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
      if (err) { return next(err); }

      client.query(
        'SELECT id,'+
        ' DATE_FORMAT(created_at, "%Y-%c-%d %k:%i:%s") AS time'+
        ' FROM chats'+
        ' WHERE id = LAST_INSERT_ID()',
        function(err2, results2) {
          if (err2) { return next(err2); }
          return next(null, results2);
        }
      );
    }
  );
};


//参加申請チャットのステータスを招待済に更新する処理
//(参加申請機能が無くなった為現在は未使用)
Chat.updateInvitation = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var chatId = params.chatId;

  client.query(
    'UPDATE chats'+
    ' SET `invited` = true'+
    ' WHERE id = ?',
    [chatId],
    function(err, results) {
      if (err) { return next(err); }
      return next(null, results);
    }
  );
};


//チャット削除処理
Chat.destroy = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var chatId = params.chatId;

  client.query(
    'UPDATE chats'+
    ' SET `delete` = true'+
    ' WHERE id = ?',
    [chatId],
    function(err, results) {
      if (err) { return next(err); }
      return next(null, results);
    }
  );
};


exports.Chat = Chat;
