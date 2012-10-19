(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chat = Backbone.Model.extend({
    id:       null,
    userId:   null,
    userName: null,
    type:     null,
    body:     null,
    image:    null,
    time:     null,
    url: '/chats'
  });

  syaberi.Chats = Backbone.Collection.extend({
    model: syaberi.Chat,
    url: '/chats'
  });


}).call(this);
