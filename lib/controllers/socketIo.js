var util = require('util');

var socket;

exports.onConnection = function(sock)  {
  socket = sock;

  socket.on('message',    onMessage);
  socket.on('disconnect', onDisconnect);
};

function onMessage(data) {
  socket.emit('message', data);
  socket.broadcast.emit('message', data);
}

function onDisconnect() {
  socket.emit('message', {value: 'user disconnected'});
}
