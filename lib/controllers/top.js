var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;

exports.index = function(req, res, next) {
  var logger = app.set('logger');

  Chatroom.findWithLatestChat({
    offset: 0,
    limit: CONST.TOP_HOUSE_NUM
  }, function(err, chatrooms) {
    if (err) { return next(err); }
    return res.render('top', {
      meta_title: 'TOP',
      chatrooms: chatrooms
    });
  });
};
