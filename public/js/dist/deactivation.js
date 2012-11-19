/******************************************************************
 * 退会情報を扱うBackbone.jsのViewクラス
 * 退会画面のロジックを記述
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.DeactivationView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1': 'submit',
      'click #cancel':   'cancel'
    },
    initialize: function() {
      this._csrf = $('#_csrf').val(); //for CSRF
    },
    //退会処理を実行
    submit: function(event) {
      event.preventDefault();
      var self = this;

      $.post(
        '/deactivation',
        {'_csrf': this._csrf},
        function(data) {
          location.href = '/';
        }
      );
    },
    //キャンセル処理を実行
    cancel: function(event) {
      event.preventDefault();
      location.href = '/mypage';
    },
    render: function() {
    }
  });

}).call(this);

/******************************************************************
 * 退会画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var deactivationView = new syaberi.DeactivationView;
    deactivationView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
