(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};

  syaberi.CreateChatroomView = Backbone.View.extend({
    el: $('html'),
    events: {
      'click #submit_1':   'submit',
      'blur input.title':  'setSearchText',
      'focus input.title': 'clearSearchText'
    },
    initialize: function() {
      this.model = new syaberi.Chatroom;
      Backbone.Validation.bind(this);
      this.token = $('#token').val(); //for CSRF
    },
    submit: function(event) {
      event.preventDefault();
      var self = this;

      this._clearSearchText($('#title1'));
      this._clearSearchText($('#title2'));

      var categoryId = $.trim($('#categoryId').val());
      var title1 = $.trim($('#title1').val());
      var title2 = $.trim($('#title2').val());
      var description = $.trim($('#description').val());
      var publicYN = $('#publicYN').val();
      //var publicYN = $('input[name="publicYN"]:checked').val();

      // model にデータset
      this.model.set({
        categoryId: categoryId,
        title1: title1,
        title2: title2,
        description: description,
        publicYN: publicYN
      });

      // データのvalidate
      if (this.model.isValid()) {
        // OKならばsave (サーバーへPOST)
        var title = title1+'けど、'+
          title2+'について、話しませんか？';
        this.model.save({
          categoryId: categoryId,
          title: title,
          description: description,
          publicYN: publicYN,
          token: this.token
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
          var msg = errors[key];
          if (key === 'title1' || key === 'title2') {
            key = 'title';
          }
          $('#error_'+key).text(msg);
        }

        self._setSearchText($('#title1'));
        self._setSearchText($('#title2'));
      });
    },
    clearSearchText: function(event) {
      var target = $(event.target);
      this._clearSearchText(target);
    },
    _clearSearchText: function(target) {
      if (target.val() === target.prop('defaultValue')) {
        target.css('color', '#000').val('');
      }
    },
    setSearchText: function(event) {
      var target = $(event.target);
      this._setSearchText(target);
    },
    _setSearchText: function(target) {
      if($.trim(target.val()) === "") {
        target.css('color', '#999')
          .val(target.prop('defaultValue'));
      }
    },
    render: function() {
    }
  });

}).call(this);
