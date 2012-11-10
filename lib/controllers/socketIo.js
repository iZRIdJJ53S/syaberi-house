var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var Chat = require('../models/chat').Chat;
var CONST = require('../const').CONST;
var utils = require('../utils');
var check  = require('validator').check;

var ownerClients = {}; //ハウスオーナーのSocket.ioのセッションを保持


exports.onConnection = function(socket)  {
  var logger = app.set('logger');
  logger.info('##socket.io: connection');

  var user;
  var _csrf;

  if (socket.handshake.session) {
    user = socket.handshake.session.passport.user;
    _csrf = socket.handshake.session._csrf;
  }
  var chatroomId = socket.handshake.query.id;
  var isUrlOpen = socket.handshake.query.urlopen;

  //未ログイン時は以降の処理を行わない
//  if (!user) { return; }

  //validation
  try {
    check(chatroomId).isInt();
  } catch (e) {
    logger.error(e.message);
    return;
  }

  // 招待機能を使わないため一時コメントアウト
  // Chatroom.findOneById(chatroomId, function(err, chatroom) {
    // if (err) { logger.error(err); return; }
    // //socket.ioにおけるオーナーのセッションIDを識別
    // // if (user && (user.id === chatroom.ownerId)) {
      // // var key = isUrlOpen ? chatroomId + '/open' : chatroomId;
      // // ownerClients[key] = socket;
    // // }
  // });

  socket.on('message', function(data) {
    logger.info('##socket.io: message');
    //CSRF Check
    if (_csrf && _csrf !== data.token) {
      logger.error('CSRF Invalid');
      return;
    }

    //validation
    try {
      check(data.chatroomId).isInt();
      check(data.userId).isInt();
      if (data.message) {
        check(data.message).len(0, 10000);
      }
      if (data.type) {
        check(data.type).isInt();
      }
    } catch (e) {
      logger.error(e.message);
      return;
    }

    Chatroom.findOneById(data.chatroomId, function(err, chatroom) {
      if (err) { logger.error(err); return; }

      data.userId = user ? user.id : data.userId;
      data.ownerId = chatroom.ownerId;

      if (data.mode === 'create') {
        if (chatroom.status !== CONST.STATUS_OPEN &&
            !data.isUrlOpen) {
          createEntry(socket, data);
        }
        else {
          createChat(socket, data);
        }
      }
      else if (data.mode === 'destroy') {
        destroy(socket, data);
      }
    });
  });

  socket.on('disconnect', function() {
    logger.info('##socket.io: disconnect');
  });
};

function createEntry(socket, data) {
  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    type: data.type,
    status: CONST.STATUS_ENTRY
  }, function(err, results) {
    if (err) { logger.error(err); return; }

    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));


    var user = socket.handshake.session.passport.user;
    var isUrlOpen = socket.handshake.query.urlopen;
    //オーナーの発言はブロードキャスト
    if (user && (user.id === data.ownerId)) {
      socket.emit('message', data);
      socket.broadcast.emit('message', data);
    }
    else {
      //参加申請での申込者の発言はオーナーと申込者本人のみにemit
      var key = isUrlOpen ? data.chatroomId + '/open' : data.chatroomId;
      var ownerSocket = ownerClients[key];
      if (ownerSocket) {
        ownerSocket.emit('message', data);
      }
      socket.emit('message', data);
    }
  });
}

function createChat(socket, data) {
  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    type: data.type,
    status: CONST.STATUS_CHAT
  }, function(err, results) {
    if (err) { logger.error(err); return; }

    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });
}

function destroy(socket, data) {
  var chatId = data.chatId;

  //validation
  try {
    check(chatId).isInt();
  } catch (e) {
    logger.error(e.message);
    return;
  }

  Chat.findOneById(chatId, function(err, chat) {
    if (err) { logger.error(err); return; }

    if (chat.userId === data.userId) {
      Chat.destroy({
        chatId: chatId
      }, function(err2, results) {
        if (err2) { logger.error(err2); return; }

        data.chatId = chatId;
        socket.emit('message', data);
        socket.broadcast.emit('message', data);
      });
    }
  });
}
