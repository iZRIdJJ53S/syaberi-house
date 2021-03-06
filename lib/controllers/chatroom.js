/*********************************************************
 * 部屋に関連するリクエストを扱うコントローラー
 *********************************************************/

var app = require('../../app');
var config = require('config');
var Chat = require('../models/chat').Chat;
var Chatroom = require('../models/chatroom').Chatroom;
var Category = require('../models/category').Category;
var CONST = require('../const').CONST;
var utils = require('../utils');
var check  = require('validator').check;
var redis = require('socket.io/node_modules/redis');
var redisClient = redis.createClient(config.redis.port, config.redis.host);
var nodeUrl = require('url');


//部屋一覧を新着順に取得する処理 (Ajax API用)
exports.index = function(req, res, next) {
  var logger = app.set('logger');
  var profileId = req.query.profileId;
  var page = req.query.page || 1;
  var mode = req.query.mode;

  //validation
  try {
    check(page).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  var num;
  if (mode === 'owner' || mode === 'entry' || mode === 'join') {
    num = CONST.MYPAGE_HOUSE_NUM;
  }
  else {
    num = CONST.TOP_HOUSE_NUM;
  }
  var offset = (page - 1) * num;

  //作成した部屋一覧を取得
  if (mode === 'owner') {
    //validation
    try {
      check(profileId).isInt();
    } catch (e) {
      logger.error(e.message);
      return next(e);
    }

    Chatroom.findOwnerRoom({
      ownerId: profileId,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //申請中の部屋一覧を取得(申請機能が無くなった為現在は未使用)
  else if (mode === 'entry') {
    Chatroom.findEntryRoom({
      userId: req.user.id,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //参加中の部屋一覧を取得
  else if (mode === 'join') {
    if (!req.isAuthenticated()) {
      return next(new utils.Unauthorized(req.url));
    }
    Chatroom.findJoinRoom({
      userId: req.user.id,
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }
  //全部屋の一覧を取得
  else {
    Chatroom.findWithLatestChat({
      offset: offset,
      limit: num + 1
    }, _indexNext);
  }

  function _indexNext(err, chatrooms) {
    if (err) { return next(err); }

    //表示件数より1件多く取得し、
    //その分が存在すればさらに次ページがあると判断する。
    var nextPage;
    if (chatrooms.length === num+1) {
      nextPage = parseInt(page, 10) + 1;
      //余分に取得した1件を削除
      chatrooms.splice(num, 1);
    }
    else {
      nextPage = 0;
    }

    // XSS 対策用に文字列エスケープする
    chatrooms.forEach(function(chatroom) {
      chatroom.title = utils.nl2br(utils.escHtml(chatroom.title));
      chatroom.description = utils.nl2br(utils.escHtml(chatroom.description));
      chatroom.category    = utils.nl2br(utils.escHtml(chatroom.category));
      chatroom.owner       = utils.nl2br(utils.escHtml(chatroom.owner));
    });


    return res.json({
      nextPage: nextPage,
      chatrooms: chatrooms
    });
  }
};


//部屋の新規作成画面を表示
exports.new = function(req, res, next) {
  var logger = app.set('logger');
  Category.find(function(err, categories) {
    if (err) { return next(err); }
    res.render('createChatroom', {
      categories: categories
    });
  });
};

//部屋の新規作成実行処理
exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var categoryId = req.param('categoryId');
  var title = req.param('title');
  var description = req.param('description');
  var publicYN = req.param('publicYN');
  var userId = req.user.id;
  var _csrf = req.session._csrf;


  //CSRF Check
  if (_csrf !== req.param('_csrf')) {
    logger.error('CSRF Invalid');
    return next(new Error());
  }

  //validation
  try {
    check(categoryId).isInt();
    check(title).len(0, 1000);
    check(description).len(0, 10000);
    check(publicYN).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  Chatroom.create({
    categoryId: categoryId,
    title: title,
    description: description,
    publicYN: publicYN,
    ownerId: userId
  }, function(err, result) {
    if (err) { return next(err); }
    var chatroomId = result.insertId;

    Chatroom.addMember({
      memberId: userId,
      chatroomId: chatroomId
    }, function(err2, result2) {
      if (err2) { return next(err); }
      res.send(200, {chatroomId: chatroomId});
    });
  });
};

//部屋詳細画面を表示
exports.show = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.param('id');
  var userId = req.user ? req.user.id : null;
  var isUrlOpen = req.path.split('/')[3] === 'open'; //チャット開催中のURLか判定

  //validation
  try {
    check(chatroomId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  //参加申請機能を無効にしているのでメンバーの取得は一時停止
  //Chatroom.findWithMembers(chatroomId, function(err, chatroom) {
  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (!chatroom) {
      return next(new utils.NotFound(req.url));
    };

    //オーナー判定
    var isOwner = false;
    if (chatroom.ownerId === userId) {
      isOwner = true;
    }
    //チャット参加者判定
    //参加申請機能を無効にしているので全員をメンバー扱いにする
    var isMember = true;
    // var isMember = false;
    // chatroom.members.forEach(function(member) {
      // if (member.userId === userId) {
        // isMember = true;
        // return false;
      // }
    // });

    //募集中の場合は申し込みのチャットのみ表示
    if (chatroom.status !== CONST.STATUS_OPEN && !isUrlOpen) {
      chatStatus = CONST.STATUS_ENTRY;
    }
    //チャット開始中
    else if ((chatroom.status !== CONST.STATUS_INVITE) &&
             isUrlOpen) {
      //参照権限チェック
      //公開設定ならログインしていなくても参照可
      //非公開設定ならオーナーと参加者以外は不可
      if (chatroom.public != 1 &&
          (!req.isAuthenticated() || (!isOwner && !isMember))) {
        res.send(401, 'このページにはアクセスできません');
        return;
      }
      chatStatus = CONST.STATUS_CHAT;
    }
    else {
      chatStatus = CONST.STATUS_CHAT;
    }

    Chat.find({
      chatroomId: chatroomId,
      status: chatStatus,
      ownerId: chatroom.ownerId,
      loginId: userId
    }, function(err, chats) {
      if (err) { return next(err); }

      //申込者が発言済かチェック
      // #参加申請機能をコメントアウト
      var alreadyDone = false;
      // chats.forEach(function(chat) {
        // if (req.user &&
            // !isOwner &&
            // chat.user_id === req.user.id
           // ) {
          // alreadyDone = true;
          // return false;
        // }
      // });


      // 画像系 / youtube のチェック
      chats.forEach(function(chat) {
        var tmp_chat_msg = chat.message;
        // URLの英数字以外は取り除く (URL判定しやすいようにする為)
        var replace_msg = tmp_chat_msg.replace(/[^\w\:\/\.]+/, '');

        var url_obj = nodeUrl.parse(replace_msg);
        //console.log(require('util').inspect(url_obj)); //debug用


        // urlの判断 message
        if (url_obj.protocol && (url_obj.protocol == 'http:' || url_obj.protocol == 'https:')) {
          var tmp_url = '';
          if (url_obj.href) {
            tmp_url = utils.getUrl(chat.message);
          }


          // 画像urlの判断
          if (utils.isImageUrl(tmp_url)) {
            // 画像urlをset
            chat.extImageUrl = tmp_url;
          }
          // Youtube の判断
          else if (utils.isYoutube(tmp_url)) {
            var youtube_vid = utils.getYoutubeVid(tmp_url);
            if (youtube_vid) {
              chat.youtubeVid = youtube_vid;
            }

          }
        } else {
          chat.extImageUrl = '';
          chat.youtubeVid = '';
        }
      });


      //URLでテンプレートファイルを切り替え
      var template = isUrlOpen ? 'chatroom' : 'lounge';

      res.render(template, {
        host: config.server.host,
        chatroom: chatroom,
        alreadyDone: alreadyDone,
        isOwner: isOwner,
        isMember: isMember,
        isUrlOpen: isUrlOpen,
        house_image: '',
        dec_image: '',
        chats: chats
      });
    });
  });

};


//部屋の削除確認画面を表示
exports.confirm_delete = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.param('id');

  //validation
  try {
    check(chatroomId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (!chatroom) {
      return next(new utils.NotFound(req.url));
    };

    //オーナー判定
    var isOwner = false;
    if (chatroom.ownerId !== req.user.id) {
      return next(new utils.Unauthorized(req.url));
    }

    res.render('deleteChatroom', {
      chatroom: chatroom
    });
  });
};


//部屋の削除実行処理
exports.delete = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.param('id');
  var _csrf = req.session._csrf;

  //CSRF Check
  if (_csrf !== req.param('_csrf')) {
    logger.error('CSRF Invalid');
    return next(new Error());
  }

  //validation
  try {
    check(chatroomId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (!chatroom) {
      return next(new utils.NotFound(req.url));
    };

    //オーナー判定
    var isOwner = false;
    if (chatroom.ownerId !== req.user.id) {
      return next(new utils.Unauthorized(req.url));
    }

    Chatroom.delete(chatroomId, function(err2) {
      if (err2) { return next(err2); }

      redisClient.hgetall("chatroomClients:"+chatroomId, function(err, clients) {
        for (client in clients) {
          redisClient.hdel("chatroomClients:"+chatroomId, client);
        }
      });

      res.json({}, 200);
    })
  });
};


//部屋への招待処理(申請機能が無くなった為現在は未使用)
exports.invite = function(req, res, next) {
  var logger = app.set('logger');
  var chatroomId = req.params.id;
  var ownerId = req.user.id;
  var memberId = req.param('member');
  var chatId = req.param('chat');

  //validation
  try {
    check(chatroomId).isInt();
    check(memberId).isInt();
    check(chatId).isInt();
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  Chatroom.findOneById(chatroomId, function(err, chatroom) {
    if (err) { return next(err); }
    if (chatroom.ownerId === ownerId) {
      Chatroom.invite({
        chatroomId: chatroomId,
        ownerId: ownerId,
        memberId: memberId,
        chatId: chatId
      }, function(err2, result) {
        if (err2) { return next(err2); }
        res.send(200, {chatroomId: chatroomId});
      });
    }
    else {
      res.send(400, 'チャットルームの登録に失敗しました');
    }
  });
};

