(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var registerView = new syaberi.RegisterView;
    registerView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);