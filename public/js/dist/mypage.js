(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //チャットルーム一覧
  syaberi.templates.mypage.list = Handlebars.compile(
    '<article class="timeline">'+
      '<div class="smatc">'+
        '<div class="topthumb_b">'+
        /**
          '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
            '<img src="/data/{{chatroom.id}}/images/thumb_m.jpg"'+
              'onerror=\'this.src="/img/common/nowprinting_m.jpg"\' class="dec_thumb_m">'+
          '</a>'+
          **/
        '</div>'+
        '<h3><a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h3>'+
        '<p>{{chatroom.description}}</p>'+
        '<table class="table_b">'+
          '<tr>'+
            '<td>'+
            '<ul class="article_ul_b" id="dec-supporters-{{chatroom.id}}"></ul>'+
            '</td>'+
            '<td class="join_b">'+
              '{{chatroom.member}}<span>人<br>参加</span>'+
            '</td>'+
          '</tr>'+
        '</table>'+
        '<div class="to_detailb padt5 txtc">'+
        '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
          '<img src="/img/top_to_detail_b.gif" alt="詳細">'+
        '</a>'+
      '</div>'+
    '</article>'
  );

  //プロフィール編集
  syaberi.templates.mypage.profile = Handlebars.compile(
    '<form action="" method="">'+
      '<table id="makecommunity_table">'+
        '<tr>'+
          '<th>ニックネーム<br><span style="color:#FF1881">※必須</span></th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area"><input type="text" name="userName" id="userName" value="{{{userName}}}"></div>'+
            '<span id="error_userName" class="error"></span>'+
          '</td>'+
        '</tr>'+
        '<tr>'+
          '<th>メールアドレス<br><span style="color:#FF1881">※必須</span></th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area"><input type="text" name="email" id="email" value="{{email}}"></div>'+
            '<span id="error_email" class="error"></span>'+
          '</td>'+
        '</tr>'+
        '<tr>'+
          '<th>紹介文</th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area">'+
              '<textarea name="description" id="description" cols="80" rows="8">{{{description}}}</textarea>'+
            '</div>'+
            '<span id="error_description" class="error"></span>'+
          '</td>'+
        '</tr>'+
      '</table>'+
      '<div class="txtc magt20 magb200">'+
        '<input type="image" src="/img/makecommunity_submit.png" width="396" height="73" alt="送信" id="submit_1">'+
      '</div>'+
    '</form>'
  );

}).call(this);

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.User = Backbone.Model.extend({
    id:          null,
    userName:    null,
    email:       null,
    description: null,
    validation: {
      userName: [
        { required: true, msg: 'ニックネームを入力してください' },
        { rangeLength: [1, 255], msg: 'ニックネームは255文字以下で入力してください' }
      ],
      email: [
        { required: true, msg: 'メールアドレスを入力してください' },
        { pattern: 'email', msg: 'メールアドレスの形式が不正です。' },
        { rangeLength: [3, 255], msg: 'メールアドレスは3文字以上255文字以下で入力してください' }
      ],
      description: [
        { rangeLength: [1, 10000], msg: '紹介文は10000文字以下で入力してください' }
      ],

    },
    url: '/users'
  });

  syaberi.Users = Backbone.Collection.extend({
    model: syaberi.User,
    url: '/users'
  });


}).call(this);

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chatroom = Backbone.Model.extend({
    id:          null,
    title:       null,
    description: null,
    categoryId:  null,
    userId:      null,
    publicYN:      null,
    validation: {
      categoryId: [
        { required: true, msg: 'カテゴリを選択してください' }
      ],
      title: [
        { required: true, msg: 'チャットルーム名を入力してください' },
        { rangeLength: [5, 100], msg: 'チャットルーム名は5文字以上100文字以下で入力してください' }
      ],
      description: [
        { required: true, msg: '説明を入力してください' },
        { rangeLength: [3, 10000], msg: '説明は3文字以上10000文字以下で入力してください' }
      ],
      publicYN: [
        { required: true, msg: '公開設定を選択してください' }
      ]
    },
    url: '/chatrooms'
  });

  syaberi.Chatrooms = Backbone.Collection.extend({
    model: syaberi.Chatroom,
    url: '/chatrooms',
    nextPage: 2,
    parse: function(response) {
      this.nextPage = response.nextPage;
      return response.chatrooms;
    }
  });


}).call(this);

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
      Backbone.Validation.bind(this);
    },
    getOwnerChatrooms: function(event) {
      this.init_list();
      $('#ownerChatrooms').addClass('on');
      this.mode = 'owner';
      this.getChatrooms();
    },
    getEntryChatrooms: function(event) {
      this.init_list();
      $('#entryChatrooms').addClass('on');
      this.mode = 'entry';
      this.getChatrooms();
    },
    getJoinChatrooms: function(event) {
      this.init_list();
      $('#joinChatrooms').addClass('on');
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
          description: description
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
      $('article', '#hakunetsu_area').removeClass('on');
      return $('#article_area').empty();
    },
  });

}).call(this);

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var mypageView = new syaberi.MyPageView;
    mypageView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
