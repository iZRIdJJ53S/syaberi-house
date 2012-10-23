var app = require('../../app');
var CONST = require('../const').CONST;


function Chatroom() {
  this.client = app.set('mySqlClient');
}

Chatroom.find = function(params, next) {
  var client = app.set('mySqlClient');
  var status = params.status;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status, '+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' WHERE cr.status = ? AND cr.`delete` = false'+
    ' ORDER BY cr.updated_at DESC',
    [status],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.findOneById = function(id, next) {
  var client = app.set('mySqlClient');
  client.query(
    'SELECT cr.id, cr.title, cr.description,'+
    ' cr.owner_id AS ownerId, cr.partner_id AS partnerId,'+
    ' cr.status, c.title AS category,'+
    ' u.name AS owner '+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN users u ON u.id = cr.owner_id'+
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


Chatroom.create = function(params, next) {
  var client = app.set('mySqlClient');
  var categoryId = params.categoryId;
  var title = params.title;
  var description = params.description;
  var ownerId = params.ownerId;

  client.query(
    'INSERT INTO chatrooms ('+
    ' category_id, title, description, owner_id, status, created_at'+
    ') VALUES ('+
    '?, ?, ?, ?, ?, NOW()'+
    ')',
    [categoryId, title, description, ownerId, CONST.STATUS_INVITE],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.start = function(params, next) {
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var ownerId = params.ownerId;
  var partnerId = params.partnerId;

  client.query(
    'UPDATE chatrooms SET'+
    ' partner_id = ?, status = ?'+
    ' WHERE id = ? AND owner_id = ?',
    [partnerId, CONST.STATUS_OPEN, chatroomId, ownerId],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


exports.Chatroom = Chatroom;
