(function() {
  var syaberi = this.syaberi != null ? this.syaberi : this.syaberi = {};
  syaberi.templates = this.syaberi.templates != null ? this.syaberi.templates : this.syaberi.templates = {};

  syaberi.templates.chatroom = {};

  syaberi.templates.chatroom.list = Handlebars.compile(
    '<div class="room">'+
        '<div class="room-inbox">'+
            '<div class="room-icon">'+
                '<a href="{{ownerpage}}">'+
                  '<img class="icon_m" src="{{ownerimage}}">'+
                '</a>'+
            '</div>'+
            '<div class="room-titlebox">'+
                '<h2 class="room-title"><a href="/chatrooms/{{id}}/open">{{title}}</a></h2>'+
                '<div class="cat-icon"><a href="#">{{category}}</a></div>'+
                '<div class="room-username"><a href="{{ownerpage}}">by.{{owner}}</a></div>'+
            '</div>'+
            '<div class="room-button">'+
                '<a href="/chatrooms/{{id}}">'+
                '{{#if isStatusInvite}}'+
                  '<input type="button" class="button_g" value="話す">'+
                '{{else}}'+
                  '<input type="button" class="button_yg" value="話す">'+
                '{{/if}}'+
               '</a>'+
            '</div>'+
        '</div>'+
        '{{#if latest}}'+
        '<div class="ask">'+
            '<div class="ask-titlebox">'+
                '<div class="ask-title" ><a href="/chatrooms/{{id}}/open">{{{latest.message}}}</a></div>'+
                '<div class="ask-username"><a href="/users/{{latest.userId}}">by.{{latest.username}}</a></div>'+
            '</div>'+
            '<div class="ask-icon"><a href="/users/{{latest.userId}}"><img class="icon_m" src="{{latest.userimage}}"></a></div>'+
        '</div>'+
        '{{/if}}'+
    '</div>'
  );


}).call(this);
