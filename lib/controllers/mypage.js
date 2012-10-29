var Chatroom = require('../models/chatroom').Chatroom;
var CONST = require('../const').CONST;


exports.index = function(req, res) {
  Chatroom.findOwnerRoom({
    ownerId: req.user.id,
    offset: 0,
    limit: CONST.MYPAGE_OWNER_HOUSE_NUM
  }, function(err, ownerChatrooms) {

    Chatroom.findJoinRoom({
      userId: req.user.id,
      offset: 0,
      limit: CONST.MYPAGE_JOIN_HOUSE_NUM
    }, function(err, joinChatrooms) {
      res.render('mypage', {
        meta_title: 'マイページ',
        ownerChatrooms: ownerChatrooms,
        joinChatrooms: joinChatrooms,
        user_dec_list: [],
        fr_sup_list: [{}]
      });
    });

  });
};
