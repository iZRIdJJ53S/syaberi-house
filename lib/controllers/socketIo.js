var socket;

exports.onConnection = function(sock)  {
  socket = sock;

  socket.on('message',    onMessage);
  socket.on('disconnect', onDisconnect);
};

function onMessage(data) {
  console.log('message: ' + data.value);
  socket.emit('message', {value: data.value});
}

function onDisconnect() {
  socket.emit('message', {value: 'user disconnected'});
}
