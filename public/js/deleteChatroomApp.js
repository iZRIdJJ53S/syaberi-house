(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var deleteChatroomView = new syaberi.DeleteChatroomView;
    deleteChatroomView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
