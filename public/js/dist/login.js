/******************************************************************
 * ログイン情報を扱うBackbone.jsのModel/Collectionクラス
 * (オリジナルアカウント管理が無くなった為現在は未使用)
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Login = Backbone.Model.extend({
    email:    null,
    password: null,
    validation: {
      email: [
        { required: true, msg: 'メールアドレスを入力してください' }
      ],
      password: [
        { required: true, msg: 'パスワードを入力してください' }
      ]
    }
  });

}).call(this);

/******************************************************************
 * ログイン情報を扱うBackbone.jsのViewクラス
 * ログイン画面のロジックを記述
 * (オリジナルアカウント管理が無くなった為現在は未使用)
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.LoginView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit'
    },
    initialize: function() {
      this.model = new syaberi.Login;
      Backbone.Validation.bind(this);
    },
    //ログイン認証処理を実行
    submit: function(event) {
      event.preventDefault();
      var email = $.trim($('#email').val());
      var password = $.trim($('#password').val());

      this.model.set({
        email: email,
        password: password
      });

      if (this.model.isValid()) {
        $('#full-form-tag').submit();
      }

      this.model.bind('validated:invalid', function(model, errors) {
        for (key in errors) {
          $('#error_'+key).text(errors[key]);
        }
      });
    },
    render: function() {
    }
  });

}).call(this);

/******************************************************************
 * オリジナルログイン画面の起点となるスクリプト
 * (オリジナルアカウント管理が無くなった為現在は未使用)
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var loginView = new syaberi.LoginView;
    loginView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
