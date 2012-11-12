/******************************************************************
 * マイページ関連のHTMLテンプレートを動的に生成するスクリプト
 * Handlebarsライブラリを使用
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //作成した部屋/参加中の部屋一覧のテンプレート
  syaberi.templates.mypage.list = Handlebars.compile(
    '<div class="room">\
        <div class="room-inbox">\
            <div class="room-icon">\
                {{#if chatroom.isOwnerInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                    <a href="{{chatroom.ownerpage}}"><img class="icon_m" src="{{chatroom.ownerimage}}"></a>\
                {{/if}}\
            </div>\
            <div class="room-titlebox">\
                <h2 class="room-title"><a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h2>\
                <div class="cat-icon"><a href="#">{{chatroom.category}}</a></div>\
                <div class="room-username">\
                    {{#if chatroom.isOwnerInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="{{chatroom.ownerpage}}">by.{{chatroom.owner}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="room-button">\
                <a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">\
                  <input type="button" class="button_yg" value="話す">\
                </a>\
            </div>\
        </div>\
    </div>'
  );

  //プロフィール設定のテンプレート
  syaberi.templates.mypage.profile = Handlebars.compile(
      '<form method="" action="" style="padding-top:20px;">\
          <table>\
              <tr>\
                  <th class="label">ニックネーム:<div class="necessity">※必須</div></th>\
                  <td class="data">\
                      <input type="text" name="userName" id="userName" class="text-box" value="{{{userName}}}">\
                      <div id="error_userName" class="error"></div>\
                  </td>\
              </tr>\
              <tr>\
                  <th class="label">メールアドレス:<div class="necessity">※必須</div></th>\
                  <td class="data">\
                      <input type="text" name="email" id="email" class="text-box" value="{{{email}}}">\
                      <div id="error_email" class="error"></div>\
                  </td>\
              </tr>\
              <tr>\
                  <th class="label">プロフィール:</th>\
                  <td class="data">\
                      <textarea name="description" id="description" class="textarea-box">{{{description}}}</textarea>\
                      <div id="error_description" class="error"></div>\
                  </td>\
              </tr>\
          </table>\
          <div class="submit">\
              <input type="button" class="button_g" id="submit_1" value="保存">\
          </div>\
          <div class="deactivate" style="margin-left:330px;">\
            <a href="/confirm_deactivation">シャベリハウスを退会する</a>\
          </div>\
      </form>'
  );

}).call(this);

/******************************************************************
 * ユーザー情報を扱うBackbone.jsのModel/Collectionクラス
 ******************************************************************/


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
      ],

    },
    url: '/users'
  });

  syaberi.Users = Backbone.Collection.extend({
    model: syaberi.User,
    url: '/users'
  });


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
 * マイページ情報を扱うBackbone.jsのViewクラス
 * マイページ画面のロジックを記述
 ******************************************************************/


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
      this._csrf = $('#_csrf').val(); //for CSRF
      Backbone.Validation.bind(this);
    },
    //作成した部屋一覧の取得処理
    getOwnerChatrooms: function(event) {
      this.init_list();
      $('li', '#owner-chatrooms').addClass('active');
      this.mode = 'owner';
      this.getChatrooms();
    },
    //申請中の部屋一覧の取得処理
    //(参加申請機能が無くなった為現在は未使用)
    getEntryChatrooms: function(event) {
      this.init_list();
      $('li', '#entry-chatrooms').addClass('active');
      this.mode = 'entry';
      this.getChatrooms();
    },
    //参加中の部屋一覧の取得処理
    getJoinChatrooms: function(event) {
      this.init_list();
      $('li', '#join-chatrooms').addClass('active');
      this.mode = 'join';
      this.getChatrooms();
    },
    //「もっと見る」の実行処理
    getMore: function(event) {
      var page = this.collection.nextPage;
      this.getChatrooms(page);
    },
    //部屋一覧を取得する共通処理
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
    //プロフィール設定を表示
    showProfile: function(event) {
      var userName = $('html').data('profilename');
      var email = $('html').data('profileemail');
      var description = $('html').data('profiledescription');

      this.init_list();
      $('#view-more-events').hide();

      $('li', '#edit-profile').addClass('active');

      var template = syaberi.templates.mypage.profile({
        userName: userName,
        email: email,
        description: description
      });
      $('#article_area').append(template);
    },
    //プロフィール更新処理を実行
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
          _csrf: this._csrf
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
    //部屋一覧を初期化
    //部屋一覧を取得時に事前に実行
    init_list: function() {
      $('li', '#owner-chatrooms').removeClass('active');
      $('li', '#join-chatrooms').removeClass('active');
      $('li', '#edit-profile').removeClass('active');
      return $('#article_area').empty();
    }
  });

}).call(this);

/******************************************************************
 * マイページ画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var mypageView = new syaberi.MyPageView;
    mypageView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
