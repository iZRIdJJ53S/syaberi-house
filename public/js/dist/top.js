/******************************************************************
 * 部屋関連のHTMLテンプレートを動的に生成するスクリプト
 * Handlebarsライブラリを使用
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chatroom = {};

  //トップページの「もっと見る」をクリックした時に追記される部屋一覧のテンプレート
  syaberi.templates.chatroom.list = Handlebars.compile(
    '<div class="room">\
        <div class="room-inbox">\
            <div class="room-icon">\
                {{#if isOwnerInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                <a href="{{ownerpage}}">\
                    <a href="{{ownerpage}}"><img class="icon_m" src="{{ownerimage}}"></a>\
                </a>\
                {{/if}}\
            </div>\
            <div class="room-titlebox">\
                <h2 class="room-title"><a href="/chatrooms/{{id}}/open">{{title}}</a></h2>\
                <div class="cat-icon"><a href="#">{{category}}</a></div>\
                <div class="room-username">\
                    {{#if isOwnerInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="{{ownerpage}}">by.{{owner}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="room-button">\
                <a href="/chatrooms/{{id}}/open">\
                {{#if isStatusInvite}}\
                  <input type="button" class="button_g" value="話す">\
                {{else}}\
                  <input type="button" class="button_yg" value="話す">\
                {{/if}}\
               </a>\
            </div>\
        </div>\
        {{#if latest}}\
        <div class="ask">\
            <div class="ask-titlebox">\
                <div class="ask-title" ><a href="/chatrooms/{{id}}/open">{{latest.message}}</a></div>\
                <div class="ask-username">\
                    {{#if latest.isInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="/users/{{latest.userId}}">by.{{latest.username}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="ask-icon">\
                {{#if latest.isInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                    <a href="/users/{{latest.userId}}"><img class="icon_m" src="{{latest.userimage}}"></a>\
                {{/if}}\
            </div>\
        </div>\
        {{/if}}\
    </div>'
  );


}).call(this);

/******************************************************************
 * 部屋情報を扱うBackbone.jsのModel/Collectionクラス
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chatroom = Backbone.Model.extend({
    id:          null,
    title1:      null,
    title2:      null,
    description: null,
    categoryId:  null,
    userId:      null,
    publicYN:      null,
    validation: {
      categoryId: [
        { required: true, msg: 'カテゴリを選択してください' }
      ],
      title1: [
        { required: true, msg: '部屋名を入力してください' },
        { rangeLength: [0, 100], msg: '部屋名は100文字以下で入力してください' }
      ],
      title2: [
        { required: true, msg: '部屋名を入力してください' },
        { rangeLength: [0, 100], msg: '部屋名は100文字以下で入力してください' }
      ],
      description: [
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

/******************************************************************
 * トップページ情報を扱うBackbone.jsのViewクラス
 * トップページ画面のロジックを記述
 ******************************************************************/


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
    //部屋一覧の「もっと見る」をクリック時の処理
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

/******************************************************************
 * トップページ画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var topView = new syaberi.TopView;
    topView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
