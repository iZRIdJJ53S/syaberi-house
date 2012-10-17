(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.User = Backbone.Model.extend({
    id:       null,
    userName: null,
    email:    null,
    password: null,
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
      password: [
        { required: true, msg: 'パスワードを入力してください' },
        { rangeLength: [6, 100], msg: 'パスワードは6文字以上100文字以下で入力してください。' },
        { pattern: /^[a-zA-Z0-9]{6,100}$/, msg: 'パスワードは半角英数字を入力してください。' }
      ]
    },
    url: '/users'
  });

  syaberi.Users = Backbone.Collection.extend({
    model: syaberi.User,
    url: '/users'
  });


}).call(this);
