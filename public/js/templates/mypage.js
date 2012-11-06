(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //チャットルーム一覧
  syaberi.templates.mypage.list = Handlebars.compile(
        '<div class="room">'+
            '<div class="room-inbox">'+
                '<div class="room-icon">'+
                    '<a href="<%= chatroom.ownerpage %>">'+
                      '<img class="icon_m" src="{オーナーアイコンURLが欲しい}">'+
                    '</a>'+
                '</div>'+
                '<div class="room-titlebox">'+
                    '<h2 class="room-title"><a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h2>'+
                    '<div class="cat-icon"><a href="#">{カテゴリ名が欲しい}</a></div>'+
                    '<div class="room-username"><a href="{オーナーページURLが欲しい}">by.{オーナー名が欲しい}</a></div>'+
                '</div>'+
                '<div class="room-button">'+
                    '<a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
                      '<input type="button" class="button_yg" value="話す">'+
                    '</a>'+
                '</div>'+
            '</div>'+
        '</div>'
/*    '<article class="timeline">'+
      '<div class="smatc">'+
        '<div class="topthumb_b">'+
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
    '</article>'*/
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
        '<input type="button" class="button_g full_width" id="submit_1" value="保存">'+
      '</div>'+
    '</form>'
  );

}).call(this);
