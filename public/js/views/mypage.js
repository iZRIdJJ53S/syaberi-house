(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.MyPageView = Backbone.View.extend({
    // <html> エレメント配下をすべて管理する
    el: $('html'),
    // イベントの定義
    events: {
      'click #ownerChatrooms':   'getOwnerChatrooms',
      'click #entryChatrooms':   'getEntryChatrooms',
      'click #joinChatrooms':    'getJoinChatrooms',
      'click #view-more-events': 'getMore'
    },
    initialize: function() {
      this.collection = new syaberi.Chatrooms;
      this.mode = 'owner';
    },
    getOwnerChatrooms: function(event) {
      this.init_list();
      $('#ownerChatrooms').addClass('on');
      this.mode = 'owner';
      this.getChatrooms(1);
    },
    getEntryChatrooms: function(event) {
      this.init_list();
      $('#entryChatrooms').addClass('on');
      this.mode = 'entry';
      this.getChatrooms(1);
    },
    getJoinChatrooms: function(event) {
      this.init_list();
      $('#joinChatrooms').addClass('on');
      this.mode = 'join';
      this.getChatrooms(1);
    },
    getMore: function(event) {
      var page = this.collection.nextPage;
      this.getChatrooms(page);
    },
    getChatrooms: function(page) {
      $('#view-more-events').hide();
      $('#view-more-loader').show();

      this.collection.fetch({
        data: {
          mode: this.mode,
          page: page
        },
        success: function(model, response) {
          var chatrooms = response.chatrooms;
          if (chatrooms) {
            $.each(response.chatrooms, function(key, chatroom) {
              var template = syaberi.templates.mypage.list(chatroom);
              $('#article_area').append(template);
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
      this.getOwnerChatrooms();
    },
    init_list: function() {
      $('article', '#hakunetsu_area').removeClass('on');
      return $('#article_area').empty();
    },
  });

}).call(this);
