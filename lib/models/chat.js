var base = require('./base');

function Chat() {
  this.client = base.initDB();
}

Chat.prototype.create = function(params, next) {
  var self = this;
  var chatroomId = params.chatroomId;
  var userId = params.userId;
  var message = params.message;
  var status = params.status;

  self.client.query(
    'INSERT INTO chats ('+
    '  chatroom_id, user_id, message, type, created_at'+
    ') VALUES ('+
    '  ?, ?, ?, ?, NOW()'+
    ')',
    [chatroomId, userId, message, status],
    function(err, results) {
      if (err) {throw err;}

      self.client.query(
        'SELECT id,'+
        ' DATE_FORMAT(created_at, "%Y-%c-%d %k:%i:%s") AS time'+
        ' FROM chats'+
        ' WHERE id = LAST_INSERT_ID()',
        function(err2, results2) {
          if (err2) {throw err2;}
          next(results2);
        }
      );
    }
  );
};

Chat.prototype.list = function(params, next) {
  var self = this;
  var chatroomId = params.chatroomId;

  self.client.query(
    'SELECT id, message,'+
    ' DATE_FORMAT(created_at, "%Y-%c-%d %k:%i:%s") AS time'+
    ' FROM chats '+
    'WHERE chatroom_id = ? AND `delete` = false '+
    'ORDER BY created_at ASC',
    [chatroomId],
    function(err, results) {
      if (err) {throw err;}
      next(results);
    }
  );
};


exports.Chat = Chat;
