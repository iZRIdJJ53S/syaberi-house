exports.show = function(req, res) {
  res.render('chatroom', {
    meta_title: 'Chat',
    is_auth_login: true,
    house_id: 1,
    house_name: 'テスト',
    house_image: '',
    house_status: 1,
    url_id: '',
    dec_image: '',
    house_desc: '',
    user_id: 10,
    user_name: 'テスト太郎',
    user_image: '',
    is_owner: false,
    is_supporter: false,
    onetime_token: '',
    is_mailsend: false
  });
};
