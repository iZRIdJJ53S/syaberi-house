var app = require('../../app');
var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;

exports.index = function(req, res, next) {
  var logger = app.set('logger');

  Chatroom.findWithLatestChat({
    offset: 0,
    limit: CONST.TOP_HOUSE_NUM + 1
  }, function(err, chatrooms) {
    if (err) { return next(err); }

    //表示件数より1件多く取得し、
    //その分が存在すればさらに次ページがあると判断する。
    var nextPage;
    if (chatrooms.length === CONST.TOP_HOUSE_NUM+1) {
      nextPage = 2;
      //余分に取得した1件を削除
      chatrooms.splice(CONST.TOP_HOUSE_NUM, 1);
    }
    else {
      nextPage = 0;
    }

    return res.render('top', {
      meta_title: 'TOP',
      chatrooms: chatrooms,
      nextPage: nextPage
    });
  });
};
