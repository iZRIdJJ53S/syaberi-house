(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.DeleteChatroomView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1': 'submit',
      'click #cancel':   'cancel'
    },
    initialize: function() {
      this.token = $('#token').val(); //for CSRF
    },
    submit: function(event) {
      event.preventDefault();
      var self = this;
      var chatroomId = $('html').data('chatroom');

      $.ajax({
        type: 'POST',
        url: '/chatrooms/'+chatroomId+'/delete',
        data: 'token='+this.token,
        success: function(data) {
          location.href = '/';
        }
      });
    },
    cancel: function(event) {
      event.preventDefault();
      var chatroomId = $('html').data('chatroom');

      location.href = '/chatrooms/'+chatroomId+'/open';
    },
    render: function() {
    }
  });

}).call(this);
