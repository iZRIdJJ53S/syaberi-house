var session = require('passport').session;

exports.index = function(req, res) {
  res.render('top', {
    meta_title: 'TOP',
    isAuth: session.isAuth,
    userId: session.userId,
    userName: session.userName,
    dec_list: []
  });
};
