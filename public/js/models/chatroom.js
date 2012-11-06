(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chatroom = Backbone.Model.extend({
    id:          null,
    title:       null,
    description: null,
    categoryId:  null,
    userId:      null,
    publicYN:      null,
    validation: {
      categoryId: [
        { required: true, msg: 'カテゴリを選択してください' }
      ],
      title: [
        { required: true, msg: 'チャットルーム名を入力してください' },
        { rangeLength: [5, 100], msg: 'チャットルーム名は5文字以上100文字以下で入力してください' }
      ],
      description: [
        { required: true, msg: '説明を入力してください' },
        { rangeLength: [3, 10000], msg: '説明は3文字以上10000文字以下で入力してください' }
      ],
      publicYN: [
        { required: true, msg: '公開設定を選択してください' }
      ]
    },
    url: '/chatrooms'
  });

  syaberi.Chatrooms = Backbone.Collection.extend({
    model: syaberi.Chatroom,
    url: '/chatrooms',
    nextPage: 2,
    parse: function(response) {
      this.nextPage = response.nextPage;
      return response.chatrooms;
    }
  });


}).call(this);
