/******************************************************************
 * チャット情報を扱うBackbone.jsのModel/Collectionクラス
 ******************************************************************/


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

  // model の集合体？
  syaberi.Chats = Backbone.Collection.extend({
    model: syaberi.Chat,
    url: '/chats'
  });


}).call(this);
