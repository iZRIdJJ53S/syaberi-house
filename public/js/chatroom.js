var socket = io.connect('http://127.0.0.1:3000');

socket.on('connect', function() {
    console.log('client: connect');
});

socket.on('message', function(data) {
  appendMessage(data);
});

socket.on('disconnect', function(client) {
    console.log(client.sessionId + ' disconnected.');
});


function appendMessage(data) {
  var comment_id = 1000; //dummy
  var JointOne = '<article class="chat-content" id="chat-content-';
  var JointTwo_l = '<div class="thread_article_thumb fltl"><img src="';
  var JointTwo_r = '<div class="thread_article_thumb fltr"><img src="';
  var user_image = data.user_image;
  var userName = data.userName;
  var message_time = data.message_time;
  var userMessage = data.userMessage;

  var chat_content_node = $(JointOne + comment_id+'">').prepend(JointTwo_l + user_image+'" width="40" height="40"></div><div class="thread_article_box_arrowl"></div><div class="thread_article_box magl22 fltl"><div class="thread_article_box_wrapp"><h4>'+userName+'</h4><div class="thread_article_date">'+this._changeEasyTimeStamp(message_time)+'</div><div class="thread_article_txt">'+userMessage+'</div></div></div>');

  $('#lines1').append(chat_content_node);
}


function _changeEasyTimeStamp(time_str) {
    if (!time_str) {return false;}
    var d = new Date(time_str);
    var date_txt = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    date_txt += ' '+d.toLocaleTimeString();

    return date_txt;
}

function _clearInputUserMessage() {
    $('#message1').val('').focus();

    $('#html_image_preview').remove();
    $('#user_up_img').remove();
    $('#drop_message').show();
}

function _getCurrentTime() {
    var d = new Date();
    var month = d.getUTCMonth();
    month++;
    if (month < 10) {month = "0" + month;}
    var day = d.getUTCDate();
    if (day < 10) {day="0" + day;}
    var year = d.getUTCFullYear();
    var hour = d.getUTCHours();
    if (hour < 10) {hour = "0" + hour;}
    var minute = d.getUTCMinutes();
    if (minute < 10) {minute = "0" + minute;}
    var second = d.getUTCSeconds();
    if (second < 10) {second = "0" + second;}
    var newdate = year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+second+"Z";

    return newdate;
}


$(function() {
  $('#message1').keydown(function(event) {
    var userMessage = $( this ).val();

    // shiftKey だったら改行
    if (event.shiftKey === true) {
      // new line
    }
    else {
      if (event.keyCode == 13) {
        if (userMessage || image_src) {
          // 自分自身(クライアント)へ描画
          var message_time = _getCurrentTime();
          // サーバーへpush して全クライアントへ配信してもらう
          socket.emit('message', {
            'user_id': 10, 'userName': '太郎', 'user_image': 'foo',
            'userMessage': userMessage, 'iframeURL': '', 'image_src': '',
            'message_time': message_time
          });

          _clearInputUserMessage();
          return false;
        } else {
          return false;
        }
      }
    }
  });
});
