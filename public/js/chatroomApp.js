(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  var host = $('html').data('host');
  var chatroomId = $('html').data('chatroom');
  var isUrlOpen = $('html').data('urlopen');
  var url;
  if (isUrlOpen) {
    url = host+'/chatrooms/'+chatroomId+'/open?id='+chatroomId+'&urlopen='+isUrlOpen;
  }
  else {
    url = host+'/chatrooms/'+chatroomId+'?id='+chatroomId;
  }
  syaberi.socket = io.connect(url);

  $(function() {
    var chatView = new syaberi.ChatView;
    chatView.render();
    Backbone.emulateHTTP = true;

    syaberi.socket.on('connect', function() {
        //console.log('client: connect');
    });

    syaberi.socket.on('message', function(data) {
      if (data.mode === 'create') {
        chatView.appendMessage(data);
      }
      else if (data.mode === 'destroy') {
        chatView.destroyMessage(data);
      }
    });

    syaberi.socket.on('disconnect', function(client) {
        //console.log(client.sessionId + ' disconnected.');
    });
  });

}).call(this);
