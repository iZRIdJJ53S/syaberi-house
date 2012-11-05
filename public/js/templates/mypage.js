(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //チャットルーム一覧
  syaberi.templates.mypage.list = Handlebars.compile(
    '<article class="timeline">'+
      '<div class="smatc">'+
        '<div class="topthumb_b">'+
        /**
          '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
            '<img src="/data/{{chatroom.id}}/images/thumb_m.jpg"'+
              'onerror=\'this.src="/img/common/nowprinting_m.jpg"\' class="dec_thumb_m">'+
          '</a>'+
          **/
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

  //プロフィール編集
  syaberi.templates.mypage.profile = Handlebars.compile(
    '<form action="" method="">'+
      '<table id="makecommunity_table">'+
        '<tr>'+
          '<th>ニックネーム<br><span style="color:#FF1881">※必須</span></th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area"><input type="text" name="userName" id="userName" value="{{{userName}}}"></div>'+
            '<span id="error_userName" class="error"></span>'+
          '</td>'+
        '</tr>'+
        '<tr>'+
          '<th>メールアドレス<br><span style="color:#FF1881">※必須</span></th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area"><input type="text" name="email" id="email" value="{{email}}"></div>'+
            '<span id="error_email" class="error"></span>'+
          '</td>'+
        '</tr>'+
        '<tr>'+
          '<th>紹介文</th>'+
          '<td>'+
            '<div class="input_makecommunity_name_area">'+
              '<textarea name="description" id="description" cols="80" rows="8">{{{description}}}</textarea>'+
            '</div>'+
            '<span id="error_description" class="error"></span>'+
          '</td>'+
        '</tr>'+
      '</table>'+
      '<div class="txtc magt20 magb200">'+
        '<input type="image" src="/img/makecommunity_submit.png" width="396" height="73" alt="送信" id="submit_1">'+
      '</div>'+
    '</form>'
  );

}).call(this);
