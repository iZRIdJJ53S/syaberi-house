var app = require('../../app');
var Chat = require('../models/chat').Chat;


exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var userId = req.user.id;
  var chatroomId = req.param('chatroomId');
  var message = req.param('message');
  var type = req.param('type');
  var status = req.param('status');

  Chat.create({
    chatroomId: chatroomId,
    userId: userId,
    message: message,
    type: type,
    status: status
  }, function(err, chatId) {
    if (err) { return next(err); }
    res.json({chatId: chatId}, 200);
  });
};

exports.destroy = function(req, res, next) {
  var logger = app.set('logger');
  var chatId = req.param('id');
  Chat.destroy({chatId: chatId}, function(err, result) {
    if (err) { return next(err); }
    res.json({chatId: chatId}, 200);
  });
};
