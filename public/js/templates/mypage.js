/******************************************************************
 * マイページ関連のHTMLテンプレートを動的に生成するスクリプト
 * Handlebarsライブラリを使用
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.mypage = {};

  //作成した部屋/参加中の部屋一覧のテンプレート
  syaberi.templates.mypage.list = Handlebars.compile(
    '<div class="room">\
        <div class="room-inbox">\
            <div class="room-icon">\
                {{#if chatroom.isOwnerInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                    <a href="{{chatroom.ownerpage}}"><img class="icon_m" src="{{chatroom.ownerimage}}"></a>\
                {{/if}}\
            </div>\
            <div class="room-titlebox">\
                <h2 class="room-title"><a href="/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}">{{chatroom.title}}</a></h2>\
                <div class="cat-icon"><a href="#">{{chatroom.category}}</a></div>\
                <div class="room-username">\
                    {{#if chatroom.isOwnerInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="{{chatroom.ownerpage}}">by.{{chatroom.owner}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="room-button">\
                <input type="button" onclick="location.href=\'/chatrooms/{{chatroom.id}}{{#if isUrlOpen}}/open{{/if}}\'" class="button_yg" value="話す" style="cursor:pointer,">\
            </div>\
        </div>\
    </div>'
  );

  //プロフィール設定のテンプレート
  syaberi.templates.mypage.profile = Handlebars.compile(
      '<form method="" action="" style="padding-top:20px;">\
          <table>\
              <tr>\
                  <th class="label">ニックネーム:<div class="necessity">※必須</div></th>\
                  <td class="data">\
                      <input type="text" name="userName" id="userName" class="text-box" value="{{userName}}">\
                      <div id="error_userName" class="error"></div>\
                  </td>\
              </tr>\
              <tr>\
                  <th class="label">メールアドレス:<div class="necessity">※必須</div></th>\
                  <td class="data">\
                      <input type="text" name="email" id="email" class="text-box" value="{{email}}">\
                      <div id="error_email" class="error"></div>\
                  </td>\
              </tr>\
              <tr>\
                  <th class="label">プロフィール:</th>\
                  <td class="data">\
                      <textarea name="description" id="description" class="textarea-box">{{description}}</textarea>\
                      <div id="error_description" class="error"></div>\
                  </td>\
              </tr>\
          </table>\
          <div class="submit">\
              <input type="button" class="button_g" id="submit_1" value="保存">\
          </div>\
          <div class="deactivate">\
            <a href="/confirm_deactivation">シャベリハウスを退会する</a>\
          </div>\
      </form>'
  );

}).call(this);
