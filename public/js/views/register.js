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
