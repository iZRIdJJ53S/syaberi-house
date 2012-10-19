var base = require('./base');

function Chat() {
  this.client = base.initDB();
}

Chat.find = function(params, next) {
  var client = base.initDB();
  var chatroomId = params.chatroomId;

  client.query(
    'SELECT c.id, c.message, c.user_id,'+
    ' u.name AS username, u.image AS userimage,'+
    ' DATE_FORMAT(c.created_at, "%Y-%c-%d %k:%i:%s") AS time'+
    ' FROM chats c'+
    ' LEFT JOIN users u ON u.id = c.user_id'+
    ' WHERE c.chatroom_id = ? AND c.`delete` = false'+
    ' ORDER BY c.created_at ASC',
    [chatroomId],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


Chat.create = function(params, next) {
  var client = base.initDB();
  var chatroomId = params.chatroomId;
  var userId = params.userId;
  var message = params.message;
  var status = params.status;

  client.query(
    'INSERT INTO chats ('+
    ' chatroom_id, user_id, message, type, created_at'+
    ') VALUES ('+
    '  ?, ?, ?, ?, NOW()'+
    ')',
    [chatroomId, userId, message, status],
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

Chat.destroy = function(params, next) {
  var client = base.initDB();
  var chatId = params.chatId;

  client.query(
    'UPDATE chats ('+
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
