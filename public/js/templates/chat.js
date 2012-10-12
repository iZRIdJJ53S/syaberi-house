(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chat = {};

  syaberi.templates.chat.chatL = Handlebars.compile('<article class="chat-content" id="chat-content-{{commendId}}"><div class="thread_article_thumb fltl"><img src="{{userImage}}" width="40" height="40"></div><div class="thread_article_box_arrowl"></div><div class="thread_article_box magl22 fltl"><div class="thread_article_box_wrapp"><h4>{{userName}}</h4><div class="thread_article_date">{{time}}</div><div class="thread_article_txt">{{message}}</div></div></div></article>');



}).call(this);
