var app = require('../../app');
var logger = app.set('logger');
var config = require('config');
var sechash = require('sechash');
var User = require('../models/user').User;


exports.new = function(req, res) {
  res.render('register', {
    onetime_token: ''
  });
};

exports.create = function(req, res) {
  var userId = req.user.id;
  var userName = req.param('userName');
  var email = req.param('email');

  User.update({
    userId: userId,
    userName: userName,
    email: email
  }, function(err, result) {
    if (err) {
      res.send(400, 'ユーザ登録に失敗しました');
    }
    req.user.name = userName;
    req.user.email = email;
    res.send(200, {userId: userId});
  });
};

exports.update = function(req, res) {
};

exports.destroy = function(req, res) {
};

exports.login = function(req, res) {
  res.render('login', {
    onetime_token: '',
    error: req.flash('error')
  });
};

exports.authenticate = function(email, password, done) {
  User.findOne(email, makeHash(password), function(err, user) {

    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'メールアドレスとパスワードの組み合わせが正しくありません' });
    }
    return done(null, user);
  });
};

exports.authenticateByTwitter = function(token, tokenSecret, profile, done) {
  var profileId = profile.id;
  var displayName = profile.displayName;
  var image = profile.photos[0].value;

  // profile idの存在チェック
  User.findOneByTwitter(profile.id, function(err, user) {
    if (err) { return done(err); }

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
        return done(null, user);
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
          return done(null, user);
        });
      }
      return done(null, user);
    }

  });
};

exports.twitterCallback = function(req, res) {
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
  done(null, user);
}

exports.deserializeUser = function(user, done) {
  done(null, user);
}

exports.logout = function(req, res){
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
