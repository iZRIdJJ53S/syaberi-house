(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chat = {};

  syaberi.templates.chat.chatL = Handlebars.compile(
    '<article class="chat-content" id="chat-content-{{chatId}}">'+
      '<div class="thread_article_thumb fltl"><img src="{{userImage}}" width="40" height="40"></div>'+
        '<div class="thread_article_box_arrowl"></div>'+
        '<div class="thread_article_box magl22 fltl">'+
        '<div class="thread_article_box_wrapp">'+
          '{{#if isInvite}}{{#unless isUrlOpen}}{{#if isOwner}}'+
            '<a href="javascript:void(0);" class="start_chat" data-userid="{{userId}}" data-chatid="{{chatId}}">[招待]</a>'+
          '{{/if}}{{/unless}}{{/if}}'+
          '<h4>{{userName}}</h4>'+
          '<div class="thread_article_date">{{time}}</div>'+
          '<div class="thread_article_txt">{{{message}}}</div>'+
        '</div>'+
      '</div>'+
    '</article>'
  );

  syaberi.templates.chat.chatR = Handlebars.compile(
    '<article class="chat-content" id="chat-content-{{chatId}}">'+
      '<div class="thread_article_thumb fltr"><img src="{{userImage}}" width="40" height="40"></div>'+
        '<div class="thread_article_box_arrowr"></div>'+
        '<div class="thread_article_box magr22 fltr">'+
        '<div class="thread_article_box_wrapp">'+
          '<img src="/img/article_close.png" width="18" height="18" alt="閉じる" class="thread_article_date delete_cmt" data-chatid="{{chatId}}">'+
          '<h4>{{userName}}</h4>'+
          '<div class="thread_article_date">{{time}}</div>'+
          '<div class="thread_article_txt">{{{message}}}</div>'+
        '</div>'+
      '</div>'+
    '</article>'
  );



}).call(this);
