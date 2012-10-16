var session = require('passport').session;
var config = require('config');
var sechash = require('sechash');
var User = require('../models/user').User;


exports.new = function(req, res) {
  res.render('register', {
    onetime_token: '',
    isAuth: session.isAuth,
    userId: session.userId,
    userName: session.userName
  });
};

exports.create = function(req, res) {
  var email = req.param('email');
  var userName = req.param('userName');
  var password = req.param('password');

  var user = new User();
  user.create({
    email: email,
    userName: userName,
    password: makeHash(password)
  }, function(err, result) {
    if (err) {
      res.send(400, 'ユーザ登録に失敗しました');
    }
    session.isAuth = true;
    session.userId = result.insertId;
    session.userName = userName;
    session.userEmail = email;
    res.send(200, {userId: result.insertId});

  });
};

exports.update = function(req, res) {
};

exports.destroy = function(req, res) {
};

exports.login = function(req, res) {
  res.render('login', {
    onetime_token: '',
    isAuth: session.isAuth,
    userId: session.userId,
    userName: session.userName,
    error: req.flash('error')
  });
};

exports.authenticate = function(email, password, done) {
  User.findOne(email, makeHash(password), function(err, user) {

    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'メールアドレスとパスワードの組み合わせが正しくありません' });
    }
    session.isAuth = true;
    session.userId = user.id;
    session.userName = user.name;
    session.userEmail = user.email;
    return done(null, user);
  });
};

exports.serializeUser = function(user, done) {
  done(null, user);
}

exports.deserializeUser = function(id, done) {
  User.findOneById(id, function (err, user) {
    done(err, user);
  });
}

exports.logout = function(req, res){
  req.logout();
  session.isAuth = false;
  session.userId = null;
  session.userName = null;
  session.userEmail = null;
  res.redirect('/');
};

function makeHash(str) {
  var result = sechash.strongHashSync(str, {
    algorithm: 'sha1',
    salt: config.server.hashSalt
  });
  return result.split(':')[3];
}
