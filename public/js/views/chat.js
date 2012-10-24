(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  var CHAT_COMMENT = 1;
  var CHAT_STAMP = 2;
  var CHAT_IMAGE = 3;

  syaberi.ChatView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':          'submit',
      'keydown #message1':        'keydown',
      'click img.delete_cmt':     'destroy',
      'click a.start_chat':       'startChat',
      'change #uploadings_input': 'upload',
      'change #message1':         'uploadOff'
    },
    initialize: function() {
      this.collection = new syaberi.Chats;
      this.uploadCancelFlg = 0;
    },
    submit: function(event) {
      var message = $.trim($('#message1').val());

      if (message && message !== '') {
        var chatroomId = $('html').data('chatroom');
        var userId = $('html').data('userid');
        var userName = $('html').data('username');
        var userImage = $('html').data('userimage');

        syaberi.socket.emit('message', {
          mode: 'create',
          chatroomId: chatroomId,
          userId: userId,
          userName: userName,
          userImage: userImage,
          message: message,
          type: CHAT_COMMENT
        });

        this.clearInputUserMessage();
        return false;
      }
    },
    keydown: function(event) {
      //shiftKey だったら改行
      if (event.shiftKey === true) {
        // new line
      }
      else {
        if (event.keyCode == 13) {
          this.submit(event);
          return false;
        }
      }
    },
    destroy: function(event) {
      if (window.confirm('本当に削除しますか？')) {
        var target = $(event.target);
        var chatId = target.attr('id');
        var chatroomId = $('html').data('chatroom');
        var userId = $('html').data('userid');
        chatId = parseInt(chatId.replace('del_cmt_', ''), 10);

        syaberi.socket.emit('message', {
          mode: 'destroy',
          chatroomId: chatroomId,
          chatId: chatId,
          userId: userId
        });
      }
    },
    startChat: function(event) {
      var target = $(event.target);
      var partnerId = target.data('userid');
      var chatroomId = $('html').data('chatroom');

      if (window.confirm('このユーザとチャットを開始しますか？')) {
        $.ajax({
          type: 'POST',
          url: '/chatrooms/'+chatroomId+'/start',
          data: 'partner='+partnerId,
          success: function(data) {
            location.reload();
          }
        });
      }
    },
    upload: function() {
      $('#uploadings_input').upload('/upload', function(res) {

        //ファイル名成型 hidden用
        if (res) {
          var seikeiOne = res;
          var seikeiTwo = seikeiOne.split('\": \"');
          var seikeiThr = seikeiTwo[1].split('\"}</pre>');

          //ファイル名 textarea用
          var lclImgOne = $('input#uploadings_input').val().split('\\');
          var lclImgTwo;

          for (var y = 0; y < lclImgOne.length; y++) {
            if (lclImgOne[y].indexOf('.jpg')  != -1 ||
                lclImgOne[y].indexOf('.jpeg') != -1 ||
                lclImgOne[y].indexOf('.JPG')  != -1 ||
                lclImgOne[y].indexOf('.png')  != -1 ||
                lclImgOne[y].indexOf('.PNG')  != -1 ||
                lclImgOne[y].indexOf('.gif')  != -1 ||
                lclImgOne[y].indexOf('.GIF')  != -1) {
              lclImgTwo = lclImgOne[y];
            }
          }

          //textareaにユーザが添付したファイル名を表示
          $('#message1').val(lclImgTwo);
          this.uploadCancelFlg = 1;
          //添付とコメントを同時に投稿できぬようテキストエリアをdisable化
          $('#message1').attr("disabled", "disabled");

          //hiddenにapp.jsから戻ってきたファイルパスを格納
          $('#realUpfile').val(seikeiThr[0]);
        }
      }, 'html');
    },
    uploadOff: function() {
      //添付とコメントを同時に投稿できぬようテキストエリアをdisable化を解除
      $('#message1').removeAttr('disabled');
      if (this.uploadCancelFlg == 1) {
        $('input#uploadings_input').val('');
        this.uploadCancelFlg = 0;
      }
    },
    appendMessage: function(data) {
      var chatTemplate;
      var status = $('html').data('status');
      var userId = $('html').data('userid');
      var ownerId = $('html').data('ownerid');
      var params = {
        chatId: data.chatId,
        userImage: data.userImage,
        userId: data.userId,
        userName: data.userName,
        time: data.time,
        message: data.message,
        isOwner: userId == ownerId,
        isInvite: status === 0
      };
      //発言者のフキダシは向きを変える
      if (userId == data.userId) {
        chatTemplate = syaberi.templates.chat.chatR(params);
      }
      else {
        chatTemplate = syaberi.templates.chat.chatL(params);
      }

      $('#lines1').append(chatTemplate);

      //募集中は申込者の投稿は1回のみ
      if (status === 0 && ownerId != userId) {
        $('#section_thread_bottom').animate({
          height:'hide',
          opacity:'hide'
        }, "slow");
      }
    },
    destroyMessage: function(data) {
      var chatId = data.chatId;
      var userId = $('html').data('userid');
      var ownerId = $('html').data('ownerid');

      //申込者の投稿フォームを復活
      if (userId && ownerId != userId && data.userId == userId) {
        $('#section_thread_bottom').animate({
          height:'show',
          opacity:'1.0'
        }, "slow");
      }

      $('#chat-content-'+chatId).animate({
        height:'hide',
        opacity:'hide'
      },
      "slow",
      function() {
        $('#chat-content-'+chatId).remove();
      });
    },
    render: function() {
    },
    clearInputUserMessage: function() {
      $('#message1').val('').focus();

      $('#html_image_preview').remove();
      $('#user_up_img').remove();
      $('#drop_message').show();
    }
  });

}).call(this);
