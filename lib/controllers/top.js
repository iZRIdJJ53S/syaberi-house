exports.index = function(req, res) {
  res.render('index', {
    meta_title: 'TOP',
    is_auth_login: true,
    dec_list: []
  });
};
