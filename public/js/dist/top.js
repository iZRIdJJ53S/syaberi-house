(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chatroom = {};

  syaberi.templates.chatroom.list = Handlebars.compile(
    '<div style="" class="searchartile">'+
      '<dl class="search_dl">'+
          '<dd class="search_dd_title">'+
            '<a href="/chatrooms/{{id}}">【{{category}}】{{title}}</a>'+
          '</dd>'+
          '<dd class="search_dd_tag" id="search_dd_tag_{{id}}"></dd>'+
          '<dd class="search_dd_txt">{{description}}</dd>'+
      '</dl>'+
      '<div class="joinedthumbs_wrapp clearfix">'+
        '<ul id="dec-supporters-{{id}}">'+
        '</ul>'+
        '<div class="joined_details" class="txtc">'+
          '<span id="joined_detail_{{id}}"></span>'+
          '<span>{{status}}</span>'+
        '</div>'+
      '</div>'+
    '</div>'
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
              if (chatroom.status === 0) {
                chatroom.status = '募集中';
              }
              else {
                chatroom.status = '開始中';
              }
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

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var topView = new syaberi.TopView;
    topView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
