/******************************************************************
 * オリジナルログイン画面の起点となるスクリプト
 * (オリジナルアカウント管理が無くなった為現在は未使用)
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var loginView = new syaberi.LoginView;
    loginView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
