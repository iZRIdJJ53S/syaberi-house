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
    chatroomId: 1,
    userId: data.userId,
    userName: data.userName,
    message: data.message,
    status: 1
  }, function(commentId) {
    data.commentId = commentId;

    socket.emit('message', data);
    socket.broadcast.emit('message', data);
  });

}

function onDisconnect() {
  socket.emit('message', {value: 'user disconnected'});
}
