var Chatroom = require('../models/chatroom').Chatroom;
var Chat = require('../models/chat').Chat;
var CONST = require('../const').CONST;
var utils = require('../utils');
var socket;


exports.onConnection = function(sock)  {
  socket = sock;

  socket.on('message',    onMessage);
  socket.on('disconnect', onDisconnect);
};

function onMessage(data) {
  Chatroom.findOneById(data.chatroomId, function(err, chatroom) {
    if (err) { throw err; }

    //ログインチェック
    var user = socket.handshake.session.passport.user;
    console.log(user);
    if (user && user.id) {
      data.userId = user.id;
      if (data.mode === 'create') {
        create(data, chatroom);
      }
      else if (data.mode === 'destroy') {
        destroy(data, chatroom);
      }
    }

  });
}

function create(data, chatroom) {
  var chatStatus;
  if (chatroom.status == CONST.STATUS_ENTRY) {
    chatStatus = CONST.STATUS_ENTRY;
  }
  else {
    chatStatus = CONST.STATUS_CHAT;
  }

  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    type: data.type,
    status: chatStatus
  }, function(err, results) {
    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });
}

function destroy(data, chatroom) {
  var chatId = data.chatId;
  Chat.findOneById(chatId, function(err, chat) {
    if (err) { throw(err); }

    if (chat.userId == data.userId) {
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

function onDisconnect() {
  //socket.emit('message', {value: 'user disconnected'});
}
