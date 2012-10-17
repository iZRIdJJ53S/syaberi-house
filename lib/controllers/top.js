var Chatroom = require('../models/chatroom').Chatroom;

exports.index = function(req, res) {
  Chatroom.find(function(err, chatrooms) {
    var params = {
      meta_title: 'TOP',
      isAuth: req.isAuthenticated(),
      chatrooms: chatrooms
    };
    if (req.isAuthenticated()) {
      params.userId = req.user.id;
      params.userName = req.user.name;
    }

    res.render('top', params);
  });
};
