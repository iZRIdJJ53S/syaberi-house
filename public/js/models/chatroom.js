(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chatroom = Backbone.Model.extend({
    id:          null,
    title:       null,
    description: null,
    userId:      null,
    validation: {
      title: [
        { required: true, msg: 'チャットルーム名を入力してください' },
        { rangeLength: [3, 20], msg: 'チャットルーム名は3文字以上20文字以下で入力してください' }
      ],
      description: [
        { required: true, msg: '説明を入力してください' },
        { rangeLength: [3, 200], msg: 'チャットルーム名は3文字以上200文字以下で入力してください' }
      ]
    },
    url: '/chatrooms'
  });

  syaberi.Chatrooms = Backbone.Collection.extend({
    model: syaberi.Chatroom,
    url: '/chatrooms'
  });


}).call(this);
