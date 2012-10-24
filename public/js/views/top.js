(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.TopView = Backbone.View.extend({
    // <html> エレメント配下をすべて管理する
    el: $('html'),
    // イベントの定義
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
