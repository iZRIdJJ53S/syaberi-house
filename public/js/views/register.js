(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.RegisterView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit'
    },
    initialize: function() {
      this.model = new syaberi.User;
      Backbone.Validation.bind(this);
    },
    submit: function(event) {
      event.preventDefault();
      var userName = $.trim($('#userName').val());
      var email = $.trim($('#email').val());
      var isTermsChecked = $('#terms_check').is(':checked');

      if (!isTermsChecked) {
        alert('利用規約に同意する必要があります');
      }
      else {
        this.model.set({
          userName: userName,
          email: email
        });

        if (this.model.isValid()) {
          this.model.save({
            userName: userName,
            email: email
          }, {
            success: function() {
              location.href = '/';
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
