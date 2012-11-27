/******************************************************************
 * チャット情報を扱うBackbone.jsのViewクラス
 * 部屋詳細画面のロジックを記述
 ******************************************************************/

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
      'click a.start_chat':       'invite',
      'change #uploadings_input': 'upload',
      'change #message1':         'uploadOff'
    },
    initialize: function() {
      this.collection = new syaberi.Chats;
      this.uploadCancelFlg = 0;
      this._csrf = $('#_csrf').val(); //for CSRF
    },
    //チャット投稿処理
    submit: function(event) {
      var message = $.trim($('#message1').val());

      if (message && message !== '') {
        var chatroomId = $('html').data('chatroom');
        var userId = $('html').data('userid');
        var userName = $('html').data('username');
        var userImage = $('html').data('userimage');
        var isUrlOpen = $('html').data('urlopen');

        syaberi.socket.emit('message', {
          mode: 'create',
          chatroomId: chatroomId,
          userId: userId,
          userName: userName,
          userImage: userImage,
          message: message,
          type: CHAT_COMMENT,
          isUrlOpen: isUrlOpen,
          _csrf: this._csrf
        });

        this.clearInputUserMessage();
        return false;
      }
    },
    //チャット入力フィールドのキーボード入力を監視
    keydown: function(event) {
      //shiftKey だったら改行
      if (event.shiftKey === true) {
        // new line
      }
      else {
        if (event.keyCode === 13) {
          this.submit(event);
          return false;
        }
      }
    },
    //チャット削除処理
    destroy: function(event) {
      if (window.confirm('本当に削除しますか？')) {
        var target = $(event.target);
        var chatId = target.data('chatid');
        var chatroomId = $('html').data('chatroom');
        var userId = $('html').data('userid');

        syaberi.socket.emit('message', {
          mode: 'destroy',
          chatroomId: chatroomId,
          chatId: chatId,
          userId: userId,
          _csrf: this._csrf
        });
      }
    },
    //参加申請を承認する処理
    //(参加申請機能が無くなった為現在は未使用)
    invite: function(event) {
      var target = $(event.target);
      var memberId = target.data('userid');
      var chatId = target.data('chatid');
      var chatroomId = $('html').data('chatroom');

      if (window.confirm('このユーザとチャットを開始しますか？')) {
        $.post(
          '/chatrooms/'+chatroomId+'/invite',
          {member: memberId, chat: chatId},
          function(data) {
            location.href = '/chatrooms/'+chatroomId+'/open';
          }
        );
      }
    },
    //ファイルアップロード処理
    //(未実装の為現在は未使用)
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
    //ファイルアップロード処理
    //(未実装の為現在は未使用)
    uploadOff: function() {
      //添付とコメントを同時に投稿できぬようテキストエリアをdisable化を解除
      $('#message1').removeAttr('disabled');
      if (this.uploadCancelFlg === 1) {
        $('input#uploadings_input').val('');
        this.uploadCancelFlg = 0;
      }
    },
    //チャット投稿後に呼ばれるチャット表示処理
    appendMessage: function(data) {
      var chatTemplate;
      var status = $('html').data('status');
      var isUrlOpen = $('html').data('urlopen');
      var userId = $('html').data('userid');
      var ownerId = $('html').data('ownerid');
      var params = {
        chatId: data.chatId,
        userImage: data.userImage,
        userId: data.userId,
        userName: data.userName,
        time: data.time,
        message: data.message,
        isOwner: userId === ownerId,
        isHis: userId === data.userId, //本人の書き込みを表すフラグ
        isInvite: status !== 2,
        isUrlOpen: isUrlOpen,
        extImageUrl: '',
        youtubeVid: ''
      };

      // urlの判断
      if (syaberi.util.isUrl(data.message)) {
        var tmp_url = syaberi.util.getUrl(data.message);

        // 画像urlの判断
        if (syaberi.util.isImageUrl(tmp_url)) {
          // 画像urlで値を上書き
          params.extImageUrl = tmp_url;
        }
        // Youtube の判断
        else if (syaberi.util.isYoutube(tmp_url)) {
          var youtube_vid = syaberi.util.getYoutubeVid(tmp_url);
          if (youtube_vid) {
            params.youtubeVid = youtube_vid;
          }
        }



        // コメント中のurlをhrefに書き換える
        if (tmp_url) {
          params.message = syaberi.util.replaceUrlInText(data.message);
        }
      }

      //オーナーのフキダシは向きを変える
      if (ownerId === data.userId) {
        chatTemplate = syaberi.templates.chat.chatL(params);
      }
      else {
        chatTemplate = syaberi.templates.chat.chatR(params);
      }

      $('#lines1').append(chatTemplate);

      //募集中は申込者の投稿は1回のみ
      if (!isUrlOpen && data.userId === userId && ownerId != userId) {
        $('#section_thread_bottom').animate({
          height:'hide',
          opacity:'hide'
        }, "slow");
      }
    },
    //チャット削除後に呼ばれるチャット削除表示処理
    destroyMessage: function(data) {
      var chatId = data.chatId;
      var userId = $('html').data('userid');
      var ownerId = $('html').data('ownerid');

      //申込者の投稿フォームを復活(参加申請機能で使用)
      if (userId && ownerId != userId && data.userId === userId) {
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
    //チャット投稿後にチャット入力フィールドを空にする処理
    clearInputUserMessage: function() {
      $('#message1').val('').focus();

      $('#html_image_preview').remove();
      $('#user_up_img').remove();
      $('#drop_message').show();
    }
  });

}).call(this);
