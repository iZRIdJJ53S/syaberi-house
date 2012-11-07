(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chat = {};

  syaberi.templates.chat.chatL = Handlebars.compile(
    '<div class="message-owner-inbox" id="chat-content-{{chatId}}">'+
        '<div class="owner-icon">'+
            '<a href="/users/{{userId}}"><img class="icon_m" src="{{userImage}}"></a>'+
        '</div>'+
        '<div class="owner-titlebox">'+
            '<p class="owner-title">{{{message}}}</p>'+
            '<div class="owner-username"><a href="/users/{{userId}}">by.{{userName}}</a></div>'+
            '<div class="owner-date">{{time}} [1]'+
            '{{#if isHis}}'+
            '<img src="/img/remove.gif" width="12" height="12" alt="閉じる" class="delete_cmt" data-chatid="{{chatId}}">'+
            '{{/if}}'+
            '</div>'+
        '</div>'+
    '</div>'
  );

  syaberi.templates.chat.chatR = Handlebars.compile(
    '<div class="message-member-inbox" id="chat-content-{{chatId}}">'+
        '<div class="member-icon">'+
            '<a href="/users/{{userId}}"><img class="icon_m" src="{{userImage}}"></a>'+
        '</div>'+
        '<div class="member-titlebox">'+
            '<p class="member-title">{{{message}}}</p>'+
            '<div class="member-username"><a href="/users/{{userId}}">by.{{userName}}</a></div>'+
            '<div class="member-date">{{time}} [2]'+
            '{{#if isHis}}'+
            '<img src="/img/remove.gif" width="12" height="12" alt="閉じる" class="delete_cmt" data-chatid="{{chatId}}">'+
            '{{/if}}'+
            '</div>'+
            '{{#if isInvite}}{{#unless isUrlOpen}}{{#if isOwner}}'+
            '<a href="javascript:void(0);" class="start_chat" data-userid="{{userId}}" data-chatid="{{chatId}}">[招待]</a>'+
            '{{/if}}{{/unless}}{{/if}}'+
        '</div>'+
    '</div>'
  );

}).call(this);
