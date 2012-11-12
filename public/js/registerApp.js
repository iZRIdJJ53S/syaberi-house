/******************************************************************
 * ユーザー新規登録画面の起点となるスクリプト
 * Twitter認証後に呼び出される
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var registerView = new syaberi.RegisterView;
    registerView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
