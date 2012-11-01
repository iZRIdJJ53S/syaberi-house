var app = require('../../app');
var config = require('config');
var sechash = require('sechash');
var User = require('../models/user').User;


exports.new = function(req, res, next) {
  var logger = app.set('logger');

  res.render('register', {
    onetime_token: ''
  });
};

exports.create = function(req, res, next) {
  var logger = app.set('logger');
  var userId = req.user.id;
  var userName = req.param('userName');
  var email = req.param('email');

  User.update({
    userId: userId,
    userName: userName,
    email: email
  }, function(err, result) {
    if (err) { return next(err) };

    req.user.name = userName;
    req.user.email = email;
    res.send(200, {userId: userId});
  });
};

exports.update = function(req, res, next) {
  var logger = app.set('logger');
};

exports.destroy = function(req, res, next) {
  var logger = app.set('logger');
};

exports.login = function(req, res, next) {
  var logger = app.set('logger');

  res.render('login', {
    onetime_token: '',
    error: req.flash('error')
  });
};

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

exports.twitterCallback = function(req, res) {
  var logger = app.set('logger');
  // メールアドレスが未登録の場合は入力画面へ
  if (!req.user.email) {
    res.redirect('/users/new');
  }
  else {
    var returnUrl = req.cookies.returnUrl;
    res.redirect(returnUrl);
  }
};


exports.serializeUser = function(user, done) {
  var logger = app.set('logger');
  done(null, user);
}

exports.deserializeUser = function(user, done) {
  var logger = app.set('logger');
  done(null, user);
}

exports.logout = function(req, res, next){
  var logger = app.set('logger');
  var returnUrl = req.cookies.returnUrl;
  req.logout();
  res.redirect(returnUrl);
};

function makeHash(str) {
  var result = sechash.strongHashSync(str, {
    algorithm: 'sha1',
    salt: config.server.hashSalt
  });
  return result.split(':')[3];
}
