(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.TopView = Backbone.View.extend({
    // <html> エレメント配下をすべて管理する
    el: $('html'),
    // イベントの定義
    events: {
      'click #view-more-events': 'getMore'
    },
    initialize: function() {
      this.collection = new syaberi.Chatrooms;
    },
    getMore: function(event) {
      $('#view-more-events').hide();
      $('#view-more-loader').show();

      this.collection.fetch({
        data: { page: this.collection.nextPage },
        success: function(model, response) {
          var chatrooms = response.chatrooms;
          if (chatrooms) {
            $.each(response.chatrooms, function(key, chatroom) {
              chatroom.isStatusInvite = chatroom.status == 0;
              var template = syaberi.templates.chatroom.list(chatroom);
              $('.left-content', '#content').append(template);
            });
          }
          $('#view-more-loader').hide();
          if (response.nextPage !== 0) {
            $('#view-more-events').show();
          }
        }
      });
    },
    render: function() {
    }
  });

}).call(this);
