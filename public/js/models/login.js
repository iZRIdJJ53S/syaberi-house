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
