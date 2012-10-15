(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.ChatView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit',
      'keydown #message1': 'keydown'
    },
    initialize: function() {
      this.collection = new syaberi.Chats;
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
    appendMessage: function(data) {
      var chatTemplate = syaberi.templates.chat.chatL({
        commendId: data.commentId,
        userImage: data.user_image,
        userName: data.userName,
        time: data.time,
        message: data.message
      });

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
