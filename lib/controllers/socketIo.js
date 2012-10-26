var Chatroom = require('../models/chatroom').Chatroom;
var Chat = require('../models/chat').Chat;
var CONST = require('../const').CONST;
var utils = require('../utils');
var app = require('../../app');
var sessionStore = app.set('sessionStore');
var ownerClients = {}; //ハウスオーナーのSocket.ioのセッションを保持

exports.onConnection = function(socket)  {

  var user = socket.handshake.session.passport.user;
  var chatroomId = socket.handshake.query.id;

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { throw err; }
    //socket.ioにおけるオーナーのセッションIDを識別
    if (user && (user.id === chatroom.ownerId)) {
      ownerClients[chatroomId] = socket;
    }
  });

  socket.on('message', function(data) {
    Chatroom.findOneById(data.chatroomId, function(err, chatroom) {
      if (err) { throw err; }

      data.userId = user.id;
      data.ownerId = chatroom.ownerId;

      if (user && data.userId) {
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
      }
    });
  });

  socket.on('disconnect', function() {
    //socket.emit('message', {value: 'user disconnected'});
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
    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));


    var user = socket.handshake.session.passport.user;
    //オーナーの発言はブロードキャスト
    if (user && (user.id === data.ownerId)) {
      socket.emit('message', data);
      socket.broadcast.emit('message', data);
    }
    else {
      //申込者の発言はオーナーと申込者本人のみにemit
      var ownerSocket = ownerClients[data.chatroomId];
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
    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });
}

function destroy(socket, data) {
  var chatId = data.chatId;
  Chat.findOneById(chatId, function(err, chat) {
    if (err) { throw(err); }

    if (chat.userId === data.userId) {
      Chat.destroy({
        chatId: chatId
      }, function(err, results) {
        data.chatId = chatId;
        socket.emit('message', data);
        socket.broadcast.emit('message', data);
      });
    }
  });
}
