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
 * ユーザー登録を扱うBackbone.jsのViewクラス
 * ユーザー登録画面のロジックを記述
 * Twitter認証後に呼び出される
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.RegisterView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit'
    },
    initialize: function() {
      this.model = new syaberi.User;
      this._csrf = $('#_csrf').val(); //for CSRF
      Backbone.Validation.bind(this);
    },
    //ユーザー登録実行処理
    submit: function(event) {
      event.preventDefault();
      var userName = $.trim($('#userName').val());
      var email = $.trim($('#email').val());
      var description = $.trim($('#description').val());
      var isTermsChecked = $('#terms_check').is(':checked');

      if (!isTermsChecked) {
        alert('利用規約に同意する必要があります');
      }
      else {
        this.model.set({
          userName: userName,
          email: email,
          description: description
        });

        if (this.model.isValid()) {
          this.model.save({
            userName: userName,
            email: email,
            description: description,
            _csrf: this._csrf
          }, {
            success: function() {
              var returnUrl = $.cookie('returnUrl');
              location.href = returnUrl;
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
      }

    },
    render: function() {
    }
  });

}).call(this);

/******************************************************************
 * ユーザー新規登録画面の起点となるスクリプト
 * Twitter認証後に呼び出される
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var registerView = new syaberi.RegisterView;
    registerView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
