exports.index = function(req, res) {
  res.render('index', {
    meta_title: 'TOP',
    isAuth: req.session.isAuth,
    dec_list: []
  });
};
