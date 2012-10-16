var base = require('./base');

var STATUS_CHAT = 0;
var STATUS_BLOG = 1;

function Chatroom() {
  this.client = base.initDB();
}

Chatroom.find = function(next) {
  var client = base.initDB();

  client.query(
    'SELECT cr.id, cr.title, cr.description,'+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' WHERE cr.`delete` = false'+
    ' ORDER BY cr.updated_at DESC',
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.findOneById = function(id, next) {
  var client = base.initDB();
  client.query(
    'SELECT cr.id, cr.title, cr.description,'+
    ' cr.user_id, cr.status, c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' WHERE cr.id = ? AND cr.`delete` = false',
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
  var categoryId = params.categoryId;
  var title = params.title;
  var description = params.description;
  var userId = params.userId;

  self.client.query(
    'INSERT INTO chatrooms ('+
    ' category_id, title, description, user_id, status, created_at'+
    ') VALUES ('+
    '?, ?, ?, ?, ?, NOW()'+
    ')',
    [categoryId, title, description, userId, STATUS_CHAT],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


exports.Chatroom = Chatroom;
