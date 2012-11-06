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

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.CreateChatroomView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit'
    },
    initialize: function() {
      this.model = new syaberi.Chatroom;
      Backbone.Validation.bind(this);
    },
    submit: function(event) {
      event.preventDefault();
      var categoryId = $.trim($('#categoryId').val());
      var title = $.trim($('#title').val());
      var description = $.trim($('#description').val());
      var publicYN = $('#publicYN').val();
      //var publicYN = $('input[name="publicYN"]:checked').val();

      // model にデータset
      this.model.set({
        categoryId: categoryId,
        title: title,
        description: description,
        publicYN: publicYN
      });

      // データのvalidate
      if (this.model.isValid()) {
        // OKならばsave (サーバーへPOST)
        this.model.save({
          categoryId: categoryId,
          title: title,
          description: description,
          publicYN: publicYN
        }, {
          success: function(model, res) {
            var chatroomId = res.chatroomId;
            location.href = '/chatrooms/'+chatroomId;
          },
          error: function(model, res) {
            alert(res.responseText);
          }
        });
      }

      // validate 失敗
      this.model.bind('validated:invalid', function(model, errors) {
        for (key in errors) {
          // エラー出力
          $('#error_'+key).text(errors[key]);
        }
      });
    },
    render: function() {
    }
  });

}).call(this);

(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  $(function() {
    var createChatroomView = new syaberi.CreateChatroomView;
    createChatroomView.render();
    Backbone.emulateHTTP = true;
  });

}).call(this);
