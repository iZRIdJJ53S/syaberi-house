var app = require('../../app');
var Chat = require('./chat').Chat;
var CONST = require('../const').CONST;


function Chatroom() {
  this.client = app.set('mySqlClient');
}

Chatroom.find = function(params, next) {
  var client = app.set('mySqlClient');
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status, '+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' WHERE cr.status != ? AND cr.`delete` = false'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [CONST.STATUS_OPEN, limit, offset],
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
    ' cr.owner_id AS ownerId,'+
    ' cr.status, cr.public, c.title AS category,'+
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

Chatroom.findOwnerRoom = function(params, next) {
  var client = app.set('mySqlClient');
  var ownerId = params.ownerId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status, '+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' WHERE cr.`delete` = false'+
    ' AND cr.owner_id = ?'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [ownerId, limit, offset],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.findEntryRoom = function(params, next) {
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT DISTINCT cr.id, cr.title, cr.description, cr.status, '+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN chats ch ON cr.id = ch.chatroom_id'+
    ' WHERE cr.`delete` = false AND ch.`delete` = false'+
    ' AND ch.status = 0'+
    ' AND ch.user_id = ? AND ch.invited = false'+
    ' AND cr.owner_id <> ?'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [userId, userId, limit, offset],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.findJoinRoom = function(params, next) {
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var offset = params.offset;
  var limit = params.limit;

  client.query(
    'SELECT cr.id, cr.title, cr.description, cr.status, '+
    ' c.title AS category'+
    ' FROM chatrooms cr'+
    ' LEFT JOIN category c ON c.id = cr.category_id'+
    ' LEFT JOIN user_chatroom_relation ucr'+
    ' ON cr.id = ucr.chatroom_id'+
    ' WHERE cr.`delete` = false'+
    ' AND ucr.user_id = ?'+
    ' ORDER BY cr.created_at DESC'+
    ' LIMIT ? OFFSET ?',
    [userId, limit, offset],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};



Chatroom.findMembers = function(id, next) {
  var client = app.set('mySqlClient');
  client.query(
    'SELECT u.id AS userId, u.name AS userName'+
    ' FROM user_chatroom_relation ucr'+
    ' LEFT JOIN users u ON u.id = ucr.user_id'+
    ' WHERE ucr.chatroom_id = ? AND u.`delete` = false'+
    ' ORDER BY ucr.created_at ASC',
    [id],
    function(err, results) {
      if (err) { next(err); }
      next(null, results);
    }
  );
};


Chatroom.findWithMembers = function(id, next) {
  Chatroom.findOneById(id, function(err, chatroom) {
    Chatroom.findMembers(id, function(err, members) {
      chatroom.members = members ? members : [];
      next(err, chatroom);
    });
  });
};


Chatroom.create = function(params, next) {
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
    [categoryId, title, description, ownerId, CONST.STATUS_INVITE, publicYN],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.addMember = function(params, next) {
  var client = app.set('mySqlClient');
  var memberId = params.memberId;
  var chatroomId = params.chatroomId;

  client.query(
    'INSERT INTO user_chatroom_relation'+
    ' VALUES(?, ?, NOW())',
    [memberId, chatroomId],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

Chatroom.updateStatus = function(params, next) {
  var client = app.set('mySqlClient');
  var chatroomId = params.chatroomId;
  var status = params.status;

  client.query(
    'UPDATE chatrooms SET'+
    ' status = ? WHERE id = ?',
    [status, chatroomId],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


Chatroom.invite = function(params, next) {
  var chatId = params.chatId;
  var memberId = params.memberId;
  var chatroomId = params.chatroomId;

  Chat.updateInvitation({
    chatId: chatId
  }, function(err, result) {

    Chatroom.updateStatus({
      chatroomId: chatroomId,
      status: CONST.STATUS_OPEN_AND_INVITE
    }, function(err, result2) {

      Chatroom.findMembers(chatroomId, function(err, members) {
        var exists = false;

        members.forEach(function(member) {
          if (member.userId == memberId) {
            exists = true;
            return false;
          }
        });

        if (!exists) {
          Chatroom.addMember(params, function(err, result3) {
            next(err, result3);
          });
        }
        else {
          next(null, null);
        }
      });
    });
  });
};

exports.Chatroom = Chatroom;
