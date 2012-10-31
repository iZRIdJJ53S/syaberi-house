(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  syaberi.templates.mypage.list = Handlebars.compile(
    '<article class="timeline">'+
      '<div class="smatc">'+
        '<div class="topthumb_b">'+
          '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
            '<img src="/data/{{chatroom.id}}/images/thumb_m.jpg"'+
              'onerror=\'this.src="/img/common/nowprinting_m.jpg"\' class="dec_thumb_m">'+
          '</a>'+
        '</div>'+
        '<h3><a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h3>'+
        '<p>{{chatroom.description}}</p>'+
        '<table class="table_b">'+
          '<tr>'+
            '<td>'+
            '<ul class="article_ul_b" id="dec-supporters-{{chatroom.id}}"></ul>'+
            '</td>'+
            '<td class="join_b">'+
              '{{chatroom.member}}<span>人<br>参加</span>'+
            '</td>'+
          '</tr>'+
        '</table>'+
        '<div class="to_detailb padt5 txtc">'+
        '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
          '<img src="/img/top_to_detail_b.gif" alt="詳細">'+
        '</a>'+
      '</div>'+
    '</article>'
  );


}).call(this);
