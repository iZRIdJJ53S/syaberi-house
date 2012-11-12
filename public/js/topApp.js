/******************************************************************
 * トップページ画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var topView = new syaberi.TopView;
    topView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
