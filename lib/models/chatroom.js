var base = require('./base');

var STATUS_CHAT = 0;
var STATUS_BLOG = 1;

function Chatroom() {
  this.client = base.initDB();
}

Chatroom.findOneById = function(id, next) {
  var client = base.initDB();

  client.query(
    'SELECT id, title, description, user_id, status'+
    ' FROM chatrooms'+
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


Chatroom.prototype.create = function(params, next) {
  var self = this;
  var title = params.title;
  var description = params.description;
  var userId = params.userId;

  self.client.query(
    'INSERT INTO chatrooms ('+
    '  title, description, user_id, status, created_at'+
    ') VALUES ('+
    '  ?, ?, ?, ?, NOW()'+
    ')',
    [title, description, userId, STATUS_CHAT],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


exports.Chatroom = Chatroom;
