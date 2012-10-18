(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.ChatView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':          'submit',
      'keydown #message1':        'keydown',
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

        syaberi.socket.emit('message', {
          chatroomId: chatroomId,
          userId: userId,
          userName: userName,
          userImage: 'dummy',
          message: message
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
    upload: function() {
      $('#uploadings_input').upload('/upload', function(res) {

        //ファイル名成型 hidden用
        if (res) {
          var seikeiOne = res;
          console.log(seikeiOne);
          var seikeiTwo = seikeiOne.split('\": \"');
          console.log(seikeiTwo);
          var seikeiThr = seikeiTwo[1].split('\"}</pre>');
          console.log(seikeiThr);

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
      var userId = $('html').data('userid');
      var params = {
        chatId: data.chatId,
        userImage: data.user_image,
        userName: data.userName,
        time: data.time,
        message: data.message
      };
      if (userId == data.userId) {
        chatTemplate = syaberi.templates.chat.chatR(params);
      }
      else {
        chatTemplate = syaberi.templates.chat.chatL(params);
      }

      $('#lines1').append(chatTemplate);
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
