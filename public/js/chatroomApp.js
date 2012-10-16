(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  var host = $('html').data('host');
  var chatroomId = $('html').data('chatroom');
  //syaberi.socket = io.connect(host+'/chatroom/'+chatroomId);
  syaberi.socket = io.connect(host);

  $(function() {
    var chatView = new syaberi.ChatView;
    chatView.render();
    Backbone.emulateHTTP = true;

    syaberi.socket.on('connect', function() {
        //console.log('client: connect');
    });

    syaberi.socket.on('message', function(data) {
      chatView.appendMessage(data);
    });

    syaberi.socket.on('disconnect', function(client) {
        //console.log(client.sessionId + ' disconnected.');
    });
  });

}).call(this);
