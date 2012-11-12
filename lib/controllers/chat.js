/*********************************************************
 * チャットに関連するリクエストを扱うコントローラー
 *********************************************************/

var app = require('../../app');
var Chat = require('../models/chat').Chat;
var check  = require('validator').check;

//チャット新規作成処理
exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var userId = req.user.id;
  var chatroomId = req.param('chatroomId');
  var message = req.param('message');
  var type = req.param('type');
  var status = req.param('status');

  //validation
  try {
    check(chatroomId).isInt();
    check(title).len(1, 10000);
    check(type).isInt();
    check(status).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

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


//チャット削除処理
exports.destroy = function(req, res, next) {
  var logger = app.set('logger');
  var chatId = req.param('id');

  //validation
  try {
    check(chatId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  Chat.destroy({chatId: chatId}, function(err, result) {
    if (err) { return next(err); }
    res.json({chatId: chatId}, 200);
  });
};
