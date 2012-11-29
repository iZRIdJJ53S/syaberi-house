/*********************************************************
 * Socket.ioを用いたリアルタイム処理のリクエスト/イベントを
 * 扱うコントローラー
 *********************************************************/


var app = require('../../app');
var config = require('config');
var Chatroom = require('../models/chatroom').Chatroom;
var Chat = require('../models/chat').Chat;
var CONST = require('../const').CONST;
var utils = require('../utils');
var check  = require('validator').check;
var cookieLib = require('cookie'); // cookie 操作npmモジュール
var redis = require('socket.io/node_modules/redis');
var redisClient = redis.createClient(config.redis.port, config.redis.host);

var ownerClients = {}; //部屋オーナーのSocket.ioのセッションを保持


//部屋に訪れた時に呼び出される処理
exports.onConnection = function(socket)  {
  var logger = app.set('logger');
  var sessionStore = app.set('sessionStore'); //Redisのセッションストア
  var chatroomId = socket.handshake.query.id;
  var isUrlOpen = socket.handshake.query.urlopen;
  var user;
  var _csrf;

  logger.info('##socket.io: connection');

  //validation
  try {
    check(chatroomId).isInt();
  } catch (e) {
    logger.error(e.message);
    return;
  }

  //部屋に接続してきたユーザーのセッションIDを部屋ごとにRedisで管理
  //部屋IDをキーにハッシュ型で保持する
  //{
  //  "ユーザー1のセッションID": true,
  //  "ユーザー2のセッションID": true,
  //  "ユーザー3のセッションID": true
  //}
  //## Socket.ioのnamespaceの独自実装
  redisClient.hset("chatroomClients:"+chatroomId, socket.id, "true");


  // // ExpressとSocket.io間でセッションを共有
  if (socket.handshake.headers.cookie) {
    var cookie = socket.handshake.headers.cookie;
    var sessionId = cookieLib.parse(cookie)['sess_id'];
    if (sessionId && typeof sessionId == 'string') {
      sessionId = sessionId.split(':')[1].split('.')[0];
    } else {
      sessionId = '';
    }

    sessionStore.get(sessionId, function(err, session) {
      if (err) { logger.error(err); return; }

      if (session) {
        user = session.passport.user;
        _csrf = session._csrf;
      }
    });
  }


  // 招待機能を使わないため一時コメントアウト
  // Chatroom.findOneById(chatroomId, function(err, chatroom) {
    // if (err) { logger.error(err); return; }
    // //socket.ioにおけるオーナーのセッションIDを識別
    // // if (user && (user.id === chatroom.ownerId)) {
      // // var key = isUrlOpen ? chatroomId + '/open' : chatroomId;
      // // ownerClients[key] = socket;
    // // }
  // });

  //チャットメッセージを追加/削除した時に呼び出される処理
  socket.on('message', function(data) {
    logger.info('##socket.io: message');

    //未ログイン時は以降の処理を行わない
    if (!user) { return; }

    //CSRF Check
    if (_csrf && _csrf !== data._csrf) {
      logger.error('CSRF Invalid');
      return;
    }

    //validation
    try {
      check(data.chatroomId).isInt();
      check(data.userId).isInt();
      if (data.message) {
        check(data.message).len(0, 10000);
      }
      if (data.type) {
        check(data.type).isInt();
      }
    } catch (e) {
      logger.error(e.message);
      return;
    }

    Chatroom.findOneById(data.chatroomId, function(err, chatroom) {
      if (err) { logger.error(err); return; }

      data.userId = user.id;
      data.ownerId = chatroom.ownerId;

      if (data.mode === 'create') {
        if (chatroom.status !== CONST.STATUS_OPEN &&
            !data.isUrlOpen) {
          createEntry(socket, data);
        }
        else {
          createChat(socket, data);
        }
      }
      else if (data.mode === 'destroy') {
        destroy(socket, data);
      }
    });
  });

  socket.on('disconnect', function() {
    logger.info('##socket.io: disconnect');
  });
};


//参加申請コメントを書き込む処理(申請機能が無くなった為現在は未使用)
function createEntry(socket, data) {
  var io = app.set('io');

  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    type: data.type,
    status: CONST.STATUS_ENTRY
  }, function(err, results) {
    if (err) { logger.error(err); return; }

    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));


    var user = socket.handshake.session.passport.user;
    var isUrlOpen = socket.handshake.query.urlopen;

    //オーナーの発言はブロードキャスト
    if (user && (user.id === data.ownerId)) {
      //Redisで管理している、部屋に接続中のユーザーにメッセージ送信
      redisClient.hkeys("chatroomClients:"+data.chatroomId, function(err, clients) {
        clients.forEach(function(sid) {
          process.nextTick(function() {
            io.sockets.socket(sid).emit('message', data);
          });
        });
      });
    }
    else {
      //参加申請での申込者の発言はオーナーと申込者本人のみにemit
      var key = isUrlOpen ? data.chatroomId + '/open' : data.chatroomId;
      var ownerSocket = ownerClients[key];
      if (ownerSocket) {
        ownerSocket.emit('message', data);
      }
      socket.emit('message', data);
    }
  });
}

//通常のチャットコメントを書き込む処理
function createChat(socket, data) {
  var io = app.set('io');

  Chat.create({
    chatroomId: data.chatroomId,
    userId: data.userId,
    message: data.message,
    type: data.type,
    status: CONST.STATUS_CHAT
  }, function(err, results) {
    if (err) { logger.error(err); return; }

    data.chatId = results[0].id;
    data.time = results[0].time;
    data.message = utils.nl2br(utils.escHtml(data.message));

    //Redisで管理している、部屋に接続中のユーザーにメッセージ送信
    redisClient.hkeys("chatroomClients:"+data.chatroomId, function(err, clients) {
      clients.forEach(function(sid) {
        process.nextTick(function() {
          io.sockets.socket(sid).emit('message', data);
        });
      });
    });
  });
}

//チャットコメントを削除する処理
function destroy(socket, data) {
  var io = app.set('io');
  var chatId = data.chatId;

  //validation
  try {
    check(chatId).isInt();
  } catch (e) {
    logger.error(e.message);
    return;
  }

  Chat.findOneById(chatId, function(err, chat) {
    if (err) { logger.error(err); return; }

    if (chat.userId === data.userId) {
      Chat.destroy({
        chatId: chatId
      }, function(err2, results) {
        if (err2) { logger.error(err2); return; }

        data.chatId = chatId;
        //Redisで管理している、部屋に接続中のユーザーにメッセージ送信
        redisClient.hkeys("chatroomClients:"+data.chatroomId, function(err, clients) {
          clients.forEach(function(sid) {
            process.nextTick(function() {
              io.sockets.socket(sid).emit('message', data);
            });
          });
        });
      });
    }
  });
}


//部屋から離れた時に呼び出される処理
exports.onDisconnect = function(socket)  {
  var logger = app.set('logger');
  var chatroomId = socket.handshake.query.id;

  logger.info('##socket.io: disconnect');

  //部屋から離れるユーザーのセッションIDを部屋から削除
  redisClient.hdel("chatroomClients:"+chatroomId, socket.id);
};
