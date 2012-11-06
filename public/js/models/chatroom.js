(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.Chatroom = Backbone.Model.extend({
    id:          null,
    title1:      null,
    title2:      null,
    description: null,
    categoryId:  null,
    userId:      null,
    publicYN:      null,
    validation: {
      categoryId: [
        { required: true, msg: 'カテゴリを選択してください' }
      ],
      title1: [
        { required: true, msg: '部屋名を入力してください' },
        { rangeLength: [0, 100], msg: '部屋名は100文字以下で入力してください' }
      ],
      title2: [
        { required: true, msg: '部屋名を入力してください' },
        { rangeLength: [0, 100], msg: '部屋名は100文字以下で入力してください' }
      ],
      description: [
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
