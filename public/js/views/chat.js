(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.ChatView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit',
      'keydown #message1': 'keydown'
    },
    initialize: function() {
      this.chats = new syaberi.Chats;
    },
    submit: function(event) {
      var message = $.trim($('#message1').val());

      if (message && message !== '') {
        var time = syaberi.util.getCurrentTime();

        syaberi.socket.emit('message', {
          'user_id': 10,
          'userName': '太郎',
          'user_image': 'dummy',
          'message': message,
          'iframeURL': '',
          'image_src': '',
          'time': time
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
        }
      }
    },
    appendMessage: function(data) {
      var comment_id = 1000; //dummy
      var JointOne = '<article class="chat-content" id="chat-content-';
      var JointTwo_l = '<div class="thread_article_thumb fltl"><img src="';
      var JointTwo_r = '<div class="thread_article_thumb fltr"><img src="';
      var user_image = data.user_image;
      var userName = data.userName;
      var time = syaberi.util.changeEasyTimeStamp(data.time);
      var message = data.message;

      var chatContent = $(JointOne + comment_id+'">').prepend(JointTwo_l + user_image+'" width="40" height="40"></div><div class="thread_article_box_arrowl"></div><div class="thread_article_box magl22 fltl"><div class="thread_article_box_wrapp"><h4>'+userName+'</h4><div class="thread_article_date">'+time+'</div><div class="thread_article_txt">'+message+'</div></div></div>');

      $('#lines1').append(chatContent);
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
