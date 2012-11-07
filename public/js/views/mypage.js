(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.MyPageView = Backbone.View.extend({
    // <html> エレメント配下をすべて管理する
    el: $('html'),
    // イベントの定義
    events: {
      'click #owner-chatrooms':   'getOwnerChatrooms',
      'click #entry-chatrooms':   'getEntryChatrooms',
      'click #join-chatrooms':    'getJoinChatrooms',
      'click #edit-profile':      'showProfile',
      'click #submit_1':          'editProfile',
      'click #view-more-events': 'getMore'
    },
    initialize: function() {
      this.model = new syaberi.User;
      this.collection = new syaberi.Chatrooms;
      this.mode = 'owner';
      this.token = $('#token').val(); //for CSRF
      Backbone.Validation.bind(this);
    },
    getOwnerChatrooms: function(event) {
      this.init_list();
      $('li', '#owner-chatrooms').addClass('active');
      this.mode = 'owner';
      this.getChatrooms();
    },
    getEntryChatrooms: function(event) {
      this.init_list();
      $('li', '#entry-chatrooms').addClass('active');
      this.mode = 'entry';
      this.getChatrooms();
    },
    getJoinChatrooms: function(event) {
      this.init_list();
      $('li', '#join-chatrooms').addClass('active');
      this.mode = 'join';
      this.getChatrooms();
    },
    getMore: function(event) {
      var page = this.collection.nextPage;
      this.getChatrooms(page);
    },
    getChatrooms: function(page) {
      var self = this;
      page = page || 1;
      var profileId = $('html').data('profileid');

      $('#view-more-events').hide();
      $('#view-more-loader').show();

      this.collection.fetch({
        data: {
          profileId: profileId,
          mode: this.mode,
          page: page
        },
        success: function(model, response) {
          var chatrooms = response.chatrooms;
          if (chatrooms) {
            $.each(response.chatrooms, function(key, chatroom) {
              var template = syaberi.templates.mypage.list({
                host: $('html').data('host'),
                chatroom: chatroom,
                isUrlOpen: self.mode === 'entry' ? false : true
              });
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
    showProfile: function(event) {
      var userName = $('html').data('profilename');
      var email = $('html').data('profileemail');
      var description = $('html').data('profiledescription');

      this.init_list();
      $('li', '#edit-profile').addClass('active');

      var template = syaberi.templates.mypage.profile({
        userName: userName,
        email: email,
        description: description
      });
      $('#article_area').append(template);
    },
    editProfile: function(event) {
      event.preventDefault();
      var userId = $('html').data('profileid');
      var userName = $.trim($('#userName').val());
      var email = $.trim($('#email').val());
      var description = $.trim($('#description').val());

      this.model.set({
        userId: userId,
        userName: userName,
        email: email,
        description: description,
        isUpdate: true
      });

      if (this.model.isValid()) {
        this.model.save({
          userId: userId,
          userName: userName,
          email: email,
          description: description,
          token: this.token
        }, {
          success: function() {
            location.href = '/mypage';
          },
          error: function(model, res) {
            alert(res.responseText);
          }
        });
      }
      this.model.bind('validated:invalid', function(model, errors) {
        for (key in errors) {
          $('#error_'+key).text(errors[key]);
        }
      });
    },

    render: function() {
      this.getOwnerChatrooms();
    },
    init_list: function() {
      $('li', '#owner-chatrooms').removeClass('active');
      $('li', '#join-chatrooms').removeClass('active');
      $('li', '#edit-profile').removeClass('active');
      return $('#article_area').empty();
    }
  });

}).call(this);
