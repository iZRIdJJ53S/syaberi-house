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

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var loginView = new syaberi.LoginView;
    loginView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
