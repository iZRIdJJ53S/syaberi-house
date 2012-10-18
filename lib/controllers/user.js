var config = require('config');
var sechash = require('sechash');
var User = require('../models/user').User;


exports.new = function(req, res) {
  var params = {
    onetime_token: '',
    isAuth: req.isAuthenticated(),
  };
  if (req.isAuthenticated()) {
    params.userId = req.user.id;
    params.userName = req.user.name;
    params.userImage = req.user.image;
  }
  res.render('register', params);
};

exports.create = function(req, res) {
  var email = req.param('email');
  var userName = req.param('userName');
  var password = req.param('password');

  User.create({
    email: email,
    userName: userName,
    password: makeHash(password)
  }, function(err, result) {
    if (err) {
      res.send(400, 'ユーザ登録に失敗しました');
    }
    res.send(200, {userId: result.insertId});
  });
};

exports.update = function(req, res) {
};

exports.destroy = function(req, res) {
};

exports.login = function(req, res) {
  var params = {
    onetime_token: '',
    isAuth: req.isAuthenticated(),
    error: req.flash('error')
  };
  if (req.isAuthenticated()) {
    params.userId = req.user.id;
    params.userName = req.user.name;
    params.userImage = req.user.image;
  }
  res.render('login', params);
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
  User.findOneByTwitter(profile.id, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      User.createByTwitter({
        id: profile.id,
        userName: profile.displayName,
        image: profile.photos[0].value,
        token: token,
        tokenSecret: tokenSecret
      }, function(err, result) {
        user = {
          id: result.insertId,
          name: profile.displayName,
          image: profile.photos[0].value
        };
        return done(null, user);
      });
    }
    else {
      return done(null, user);
    }
  });
};

exports.serializeUser = function(user, done) {
  done(null, user);
}

exports.deserializeUser = function(user, done) {
  done(null, user);
}

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

function makeHash(str) {
  var result = sechash.strongHashSync(str, {
    algorithm: 'sha1',
    salt: config.server.hashSalt
  });
  return result.split(':')[3];
}
