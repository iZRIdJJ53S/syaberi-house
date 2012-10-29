(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chatroom = {};

  syaberi.templates.chatroom.list = Handlebars.compile(
    '<div style="" class="searchartile">'+
      '<dl class="search_dl">'+
          '<dd class="search_dd_title">'+
            '<a href="/chatrooms/{{id}}">【{{category}}】{{title}}</a>'+
          '</dd>'+
          '<dd class="search_dd_tag" id="search_dd_tag_{{id}}"></dd>'+
          '<dd class="search_dd_txt">{{description}}</dd>'+
      '</dl>'+
      '<div class="joinedthumbs_wrapp clearfix">'+
        '<ul id="dec-supporters-{{id}}">'+
        '</ul>'+
        '<div class="joined_details" class="txtc">'+
          '<span id="joined_detail_{{id}}"></span>'+
          '<span>{{status}}</span>'+
        '</div>'+
      '</div>'+
    '</div>'
  );



}).call(this);
