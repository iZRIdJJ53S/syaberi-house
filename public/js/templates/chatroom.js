/******************************************************************
 * 部屋関連のHTMLテンプレートを動的に生成するスクリプト
 * Handlebarsライブラリを使用
 ******************************************************************/


(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chatroom = {};

  //トップページの「もっと見る」をクリックした時に追記される部屋一覧のテンプレート
  syaberi.templates.chatroom.list = Handlebars.compile(
    '<div class="room">\
        <div class="room-inbox">\
            <div class="room-icon">\
                {{#if isOwnerInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                <a href="{{ownerpage}}">\
                    <a href="{{ownerpage}}"><img class="icon_m" src="{{ownerimage}}"></a>\
                </a>\
                {{/if}}\
            </div>\
            <div class="room-titlebox">\
                <h2 class="room-title"><a href="/chatrooms/{{id}}/open">{{title}}</a></h2>\
                <div class="cat-icon"><a href="#">{{category}}</a></div>\
                <div class="room-username">\
                    {{#if isOwnerInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="{{ownerpage}}">by.{{owner}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="room-button">\
                <a href="/chatrooms/{{id}}/open">\
                {{#if isStatusInvite}}\
                  <input type="button" class="button_g" value="話す">\
                {{else}}\
                  <input type="button" class="button_yg" value="話す">\
                {{/if}}\
               </a>\
            </div>\
        </div>\
        {{#if latest}}\
        <div class="ask">\
            <div class="ask-titlebox">\
                <div class="ask-title" ><a href="/chatrooms/{{id}}/open">{{latest.message}}</a></div>\
                <div class="ask-username">\
                    {{#if latest.isInactive}}\
                        by.退会済み\
                    {{else}}\
                        <a href="/users/{{latest.userId}}">by.{{latest.username}}</a>\
                    {{/if}}\
                </div>\
            </div>\
            <div class="ask-icon">\
                {{#if latest.isInactive}}\
                    <img class="icon_m" src="/img/chara.png">\
                {{else}}\
                    <a href="/users/{{latest.userId}}"><img class="icon_m" src="{{latest.userimage}}"></a>\
                {{/if}}\
            </div>\
        </div>\
        {{/if}}\
    </div>'
  );


}).call(this);
