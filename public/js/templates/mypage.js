(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //チャットルーム一覧
  syaberi.templates.mypage.list = Handlebars.compile(
    '<div class="room">'+
        '<div class="room-inbox">'+
            '<div class="room-icon">'+
                '<a href="http://{{host}}{{chatroom.ownerpage}}">'+
                  '<img class="icon_m" src="{{chatroom.ownerimage}}">'+
                '</a>'+
            '</div>'+
            '<div class="room-titlebox">'+
                '<h2 class="room-title"><a href="http://{{host}}/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h2>'+
                '<div class="cat-icon"><a href="#">{{chatroom.category}}</a></div>'+
                '<div class="room-username"><a href="http://{{host}}{{chatroom.ownerpage}}">by.{{chatroom.owner}}</a></div>'+
            '</div>'+
            '<div class="room-button">'+
                '<a href="http://{{host}}/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">'+
                  '<input type="button" class="button_yg" value="話す">'+
                '</a>'+
            '</div>'+
        '</div>'+
    '</div>'
  );

  //プロフィール編集
  syaberi.templates.mypage.profile = Handlebars.compile(
            '<form method="" action="" style="padding-top:20px;">'+
                '<table>'+
                    '<tr>'+
                        '<th class="label">ニックネーム:<div class="necessity">※必須</div></th>'+
                        '<td class="data">'+
                            '<input type="text" name="userName" id="userName" class="text-box" value="{{{userName}}}">'+
                            '<div id="error_userName" class="error"></div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th class="label">メールアドレス:<div class="necessity">※必須</div></th>'+
                        '<td class="data">'+
                            '<input type="text" name="email" id="email" class="text-box" value="{{{email}}}">'+
                            '<div id="error_email" class="error"></div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th class="label">プロフィール:</th>'+
                        '<td class="data">'+
                            '<textarea name="description" id="description" class="textarea-box">{{{description}}}</textarea>'+
                            '<div id="error_description" class="error"></div>'+
                        '</td>'+
                    '</tr>'+
                '</table>'+
                '<div class="submit">'+
                    '<input type="button" class="button_g" id="submit_1" value="保存">'+
                '</div>'+
            '</form>'
  );

}).call(this);
