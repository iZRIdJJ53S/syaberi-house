var Chat = require('../models/chat').Chat;


exports.create = function(req, res) {
  var userId = 10;
  var userName = '太郎';
  var message = req.param('message');

  var chat = new Chat();
  chat.create({
    chatroomId: 1,
    userId: userId,
    userName: userName,
    message: message,
    status: 1
  }, function(commentId) {
    res.json({commentId: commentId }, 200);
  });

};
