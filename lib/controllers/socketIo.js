var Chat = require('../models/chat').Chat;
var utils = require('../utils');
var socket;

exports.onConnection = function(sock)  {
  socket = sock;

  socket.on('message',    onMessage);
  socket.on('disconnect', onDisconnect);
};

function onMessage(data) {
  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    status: 1
  }, function(err, results) {
    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });

}

function onDisconnect() {
  //socket.emit('message', {value: 'user disconnected'});
}
