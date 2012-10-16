(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.TopView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #new_chatroom':   'submit'
    },
    initialize: function() {
      this.model = new syaberi.Chat;
    },
    submit: function(event) {
      //event.preventDefault();
    },
    render: function() {
    }
  });

}).call(this);
