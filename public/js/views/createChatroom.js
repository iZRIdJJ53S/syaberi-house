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

      // model にデータset
      this.model.set({
        categoryId: categoryId,
        title: title,
        description: description
      });

      // データのvalidate
      if (this.model.isValid()) {
        // OKならばsave (サーバーへPOST)
        this.model.save({
          categoryId: categoryId,
          title: title,
          description: description
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
