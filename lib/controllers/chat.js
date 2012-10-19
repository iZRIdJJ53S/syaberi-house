var Chat = require('../models/chat').Chat;


exports.create = function(req, res) {
  var userId = req.user.id;
  var chatroomId = req.param('chatroomId');
  var message = req.param('message');

  Chat.create({
    chatroomId: chatroomId,
    userId: userId,
    message: message,
    status: 1
  }, function(err, chatId) {
    res.json({chatId: chatId}, 200);
  });
};

exports.destroy = function(req, res) {
  var chatId = req.param('id');
  Chat.destroy({chatId: chatId}, function(err, result) {
    res.json({chatId: chatId}, 200);
  });
};
