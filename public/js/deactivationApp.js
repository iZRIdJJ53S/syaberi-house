(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var deactivationView = new syaberi.DeactivationView;
    deactivationView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
