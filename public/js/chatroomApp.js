/******************************************************************
 * 部屋詳細画面の起点となるスクリプト
 * Socket.IOの初期化処理を実行
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  var host = $('html').data('host');
  var chatroomId = $('html').data('chatroom');
  var isUrlOpen = $('html').data('urlopen');
  var url;
  var connected = false;

  if (isUrlOpen) {
    url = host+'?id='+chatroomId+'&urlopen='+isUrlOpen;
  }
  else {
    url = host+'?id='+chatroomId;
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

    // サーバー側から受信した場合 -> サーバー側 emit('message', data);
    syaberi.socket.on('message', function(data) {
      if (data.mode === 'create') {
        chatView.appendMessage(data);
      }
      else if (data.mode === 'destroy') {
        chatView.destroyMessage(data);
      }
    });

    // サーバー側から受信した場合 -> サーバー側 emit('room_members', total);
    syaberi.socket.on('room_members', function(total) {
      chatView.updateRoomMember(total);
    });

  });
}).call(this);
