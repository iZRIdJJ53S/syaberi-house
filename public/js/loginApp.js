(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var loginView = new syaberi.LoginView;
    loginView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
