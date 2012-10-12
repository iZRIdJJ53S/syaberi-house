var Chat = require('../models/chat').Chat;

var socket;

exports.onConnection = function(sock)  {
  socket = sock;

  socket.on('message',    onMessage);
  socket.on('disconnect', onDisconnect);
};

function onMessage(data) {
  var chat = new Chat();
  chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    userName: data.userName,
    message: data.message,
    status: 1
  }, function(results) {
    data.commentId = results[0].id;
    data.time = results[0].time;

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });

}

function onDisconnect() {
  socket.emit('message', {value: 'user disconnected'});
}
