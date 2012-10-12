var User = require('../models/user').User;


exports.new = function(req, res) {
  res.render('register', {
    onetime_token: ''
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
    password: password
  }, function(err, result) {
    if (err) { throw err; }
    req.session.isAuth = true;
    req.session.isAuth = true;
    req.session.user = {
      email: email,
      userName: userName,
    };
    res.redirect('/');
  });
};

exports.authenticate = function(username, password, done) {
  // User.findOne({ username: username }, function (err, user) {
    // if (err) { return done(err); }
    // if (!user) {
      // return done(null, false, { message: 'Unknown user' });
    // }
    // if (!user.validPassword(password)) {
      // return done(null, false, { message: 'Invalid password' });
    // }
    // return done(null, user);
  // });
};


exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

