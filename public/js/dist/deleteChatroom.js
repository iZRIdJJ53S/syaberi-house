/*******************************************
 * 部屋の削除を扱うBackbone.jsのViewクラス
 * 部屋削除画面のロジックを記述
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.DeleteChatroomView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1': 'submit',
      'click #cancel':   'cancel'
    },
    initialize: function() {
      this._csrf = $('#_csrf').val(); //for CSRF
    },
    //部屋の削除処理を実行
    submit: function(event) {
      event.preventDefault();
      var self = this;
      var chatroomId = $('html').data('chatroom');

      $.ajax({
        type: 'POST',
        url: '/chatrooms/'+chatroomId+'/delete',
        data: '_csrf='+this._csrf,
        success: function(data) {
          location.href = '/';
        }
      });
    },
    //キャンセル処理を実行
    cancel: function(event) {
      event.preventDefault();
      var chatroomId = $('html').data('chatroom');

      location.href = '/chatrooms/'+chatroomId+'/open';
    },
    render: function() {
    }
  });

}).call(this);

/******************************************************************
 * 部屋削除画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var deleteChatroomView = new syaberi.DeleteChatroomView;
    deleteChatroomView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
