/******************************************************************
 * 部屋作成画面の起点となるスクリプト
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var createChatroomView = new syaberi.CreateChatroomView;
    createChatroomView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
