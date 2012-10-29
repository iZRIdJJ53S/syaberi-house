(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var mypageView = new syaberi.MyPageView;
    mypageView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
