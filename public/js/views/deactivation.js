(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.DeactivationView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1': 'submit',
      'click #cancel':   'cancel'
    },
    initialize: function() {
      this.token = $('#token').val(); //for CSRF
    },
    submit: function(event) {
      event.preventDefault();
      var self = this;

      $.ajax({
        type: 'POST',
        url: '/deactivation',
        data: 'token='+this.token,
        success: function(data) {
          location.href = '/';
        }
      });
    },
    cancel: function(event) {
      event.preventDefault();
      location.href = '/mypage';
    },
    render: function() {
    }
  });

}).call(this);
