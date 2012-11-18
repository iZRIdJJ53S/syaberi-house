/*********************************************************
 * ユーザー情報に関連するリクエストを扱うコントローラー
 *********************************************************/


var app = require('../../app');
var config = require('config');
var sechash = require('sechash');
var User = require('../models/user').User;
var Mail = require('../utils/mail').Mail;
var check  = require('validator').check;


//ユーザー新規登録画面を表示
exports.new = function(req, res, next) {
  var logger = app.set('logger');

  res.render('register', {
  });
};


//ユーザー新規登録/更新処理を実行
exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var userId = req.user.id;
  var userName = req.param('userName');
  var email = req.param('email');
  var description = req.param('description');
  var isUpdate = req.param('isUpdate');
  var _csrf = req.session._csrf;

  logger.info('#####create');

  //CSRF Check
  if (_csrf !== req.param('_csrf')) {
    logger.error('CSRF Invalid');
    return next(new Error());
  }

  //validation
  try {
    check(userId).isInt();
    check(userName).len(1, 255);
    check(email).isEmail();
    if (description) {
      check(description).len(0, 10000);
    }
  } catch (e) {
    logger.error(e.message);
    return next(e);
  }

  User.update({
    userId: userId,
    userName: userName,
    email: email,
    description: description
  }, function(err, result) {
    if (err) { return next(err) };

    //メール通知
    var mail = new Mail();
    //新規登録時
    if (!isUpdate) {
      mail.sendWelcomeMail(userName, email);
    }
    //プロフィール更新時
    else {
      //メール通知
      mail.sendProfileMail(userName, email);
    }

    //セッション情報を更新
    req.user.name = userName;
    req.user.email = email;

    res.send(200, {userId: userId});
  });
};


//オリジナルアカウントのログイン画面を表示(現在は未使用)
exports.login = function(req, res, next) {
  var logger = app.set('logger');

  res.render('login', {
    error: req.flash('error')
  });
};

//オリジナルアカウントのログイン認証処理(現在は未使用)
exports.authenticate = function(email, password, next) {
  var logger = app.set('logger');

  User.findOne(email, makeHash(password), function(err, user) {

    if (err) { return next(err); }
    if (!user) {
      return next(null, false, { message: 'メールアドレスとパスワードの組み合わせが正しくありません' });
    }
    return next(null, user);
  });
};


//Twitter認証後に呼び出されるコールバック処理
exports.authenticateByTwitter = function(token, tokenSecret, profile, next) {
  var logger = app.set('logger');
  var profileId = profile.id;
  var displayName = profile.displayName;
  var image = profile.photos[0].value;

  // profile idの存在チェック
  User.findOneByTwitter(profile.id, function(err, user) {
    if (err) { return next(err); }

    // profile idが存在しない場合新規登録
    if (!user) {

      User.createByTwitter({
        id: profileId,
        userName: displayName,
        image: image,
        token: token,
        tokenSecret: tokenSecret
      }, function(err, result) {
        user = {
          id: result.insertId,
          name: displayName,
          image: image
        };
        return next(null, user);
      });

    }
    else {

      // 画像URLが異なる場合アップデート
      if (user.image !== image) {
        User.updateTwitterImage({
          id: profileId,
          image: image
        }, function(err, result) {
          user = {
            id: profileId,
            name: displayName,
            image: image,
            email: user.email
          };
          return next(null, user);
        });
      }
      return next(null, user);
    }

  });
};

//Twitter認証フローの最後に呼び出されるコールバック処理
exports.twitterCallback = function(req, res) {
  var logger = app.set('logger');
  //メールアドレスが未登録の場合は新規登録画面へ
  if (!req.user.email) {
    res.redirect('/users/new');
  }
  //メールアドレス登録済の場合は元にいた画面に遷移
  else {
    var returnUrl = req.cookies.returnUrl;
    if (typeof returnUrl == 'string' && returnUrl) {
      // nothing
    } else {
      returnUrl = '/';
    }
    res.redirect(returnUrl);
  }
};

//Passportライブラリで使用しているユーザー情報のシリアライズ処理
exports.serializeUser = function(user, done) {
  var logger = app.set('logger');
  done(null, user);
}

//Passportライブラリで使用しているユーザー情報のデシリアライズ処理
exports.deserializeUser = function(user, done) {
  var logger = app.set('logger');
  done(null, user);
}

//ログアウト処理
exports.logout = function(req, res, next){
  var logger = app.set('logger');
  var returnUrl = req.cookies.returnUrl;
  if (typeof returnUrl == 'string' && returnUrl) {
    // nothing
  } else {
    returnUrl = '/';
  }
  req.logout();
  res.redirect(returnUrl);
};

//オリジナルアカウント管理で使用するパスワードハッシュ化処理
//(現在は未使用)
function makeHash(str) {
  var result = sechash.strongHashSync(str, {
    algorithm: 'sha1',
    salt: config.server.hashSalt
  });
  return result.split(':')[3];
}
