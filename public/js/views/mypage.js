(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.MyPageView = Backbone.View.extend({
    // <html> エレメント配下をすべて管理する
    el: $('html'),
    // イベントの定義
    events: {
      'click #new_chatroom':   'submit',
      'click #view-more-events': 'getMore'
    },
    initialize: function() {
      this.model = new syaberi.Chatroom;
      this.collection = new syaberi.Chatrooms;
    },
    submit: function(event) {
      //event.preventDefault();
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
              var template = syaberi.templates.chatroom.list(chatroom);
              $('#section_searchcommu').append(template);
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
