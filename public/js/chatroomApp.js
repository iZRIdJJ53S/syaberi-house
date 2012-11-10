(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  var host = $('html').data('host');
  var chatroomId = $('html').data('chatroom');
  var isUrlOpen = $('html').data('urlopen');
  var url;
  var connected = false;

  if (isUrlOpen) {
    url = host+'/chatrooms/'+chatroomId+'/open?id='+chatroomId+'&urlopen='+isUrlOpen;
  }
  else {
    url = host+'/chatrooms/'+chatroomId+'?id='+chatroomId;
  }

  syaberi.socket = io.connect(url, {
    'reconnect': true,
    'reconnection delay': 300,
    'max reconnection attempts': 10
  });

  syaberi.socket.on('connect', function() {
    connected = true;
  });


  syaberi.socket.on('disconnect', function(client) {
    connected = false;
  });


  $(function() {
    var chatView = new syaberi.ChatView;
    chatView.render();
    Backbone.emulateHTTP = true;

    syaberi.socket.on('message', function(data) {
      if (data.mode === 'create') {
        chatView.appendMessage(data);
      }
      else if (data.mode === 'destroy') {
        chatView.destroyMessage(data);
      }
    });
  });

  setInterval(function() {
    if (!connected) {
      window.location.reload();
    }
  }, 2500);
}).call(this);
