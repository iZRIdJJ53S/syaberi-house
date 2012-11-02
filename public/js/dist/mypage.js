(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  syaberi.templates.mypage.list = Handlebars.compile(
    '<article class="timeline">'+
      '<div class="smatc">'+
        '<div class="topthumb_b">'+
          '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
            '<img src="/data/{{chatroom.id}}/images/thumb_m.jpg"'+
              'onerror=\'this.src="/img/common/nowprinting_m.jpg"\' class="dec_thumb_m">'+
          '</a>'+
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
        { rangeLength: [3, 20], msg: 'チャットルーム名は3文字以上20文字以下で入力してください' }
      ],
      description: [
        { required: true, msg: '説明を入力してください' },
        { rangeLength: [3, 200], msg: 'チャットルーム名は3文字以上200文字以下で入力してください' }
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
