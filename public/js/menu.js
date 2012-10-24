(function() {

  var fukidashi_my = 0;
  $(function() {
    // twitter-login がクリックされたら
    // returnUrl をSETして認証ページへリダイレクト
    $('#login_button_twetter').click(function(event) {
      event.preventDefault();
      $.cookie('returnUrl', location.href, {path: '/'});
      location.href = $(this).attr('href');
    });

    // menu のスライドダウン
    $('#header_right').live('click', function(event) {
      $.cookie('returnUrl', location.href, {path: '/'});

      if ($('#mypage_notification_wrapp').css('display') == 'none') {
        $('#mypage_notification_wrapp').slideDown('fast');
        ovarrayfunc();
        fukidashi_my = 1;
      }
      else {
        $('#mypage_notification_wrapp').slideUp('fast');
        ovarrayfunc_del();
        fukidashi_my = 0;
      }
    });
  });

  var doc_h;
  function ovarrayfunc() {
    doc_h = $(document).height();
    $('body').append('<div id="original_overray" style="height:'+doc_h+'px;"></div>');
  }
  function ovarrayfunc_del() {
    $('#original_overray').remove();
  }

}).call(this);
