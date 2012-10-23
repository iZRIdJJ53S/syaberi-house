var app = require('../../app');

function User() {
  this.client = app.set('mySqlClient');
}

User.findOne = function(email, password, next) {
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email FROM users'+
    ' WHERE email = ? AND password = ? AND `delete` = false',
    [email, password],
    function(err, results) {
      if (err) { next(err); }
      if (results.length > 0) {
        next(null, results[0]);
      }
      else {
        next(null, null);
      }
    }
  );
};

User.findOneByTwitter = function(id, next) {
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email, image FROM users'+
    ' WHERE oauth_id = ? AND `delete` = false',
    [id],
    function(err, results) {
      if (err) { next(err); }
      if (results.length > 0) {
        next(null, results[0]);
      }
      else {
        next(null, null);
      }
    }
  );
};

User.findOneById = function(id, next) {
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email FROM users'+
    ' WHERE id = ? AND `delete` = false',
    [id],
    function(err, results) {
      if (err) { next(err); }
      if (results.length > 0) {
        next(null, results[0]);
      }
      else {
        next(null, null);
      }
    }
  );
};


User.create = function(params, next) {
  var client = app.set('mySqlClient');
  var email = params.email;
  var userName = params.userName;
  var password = params.password;

  client.query(
    'INSERT INTO users ('+
    ' email, name, password, created_at, `delete`'+
    ') VALUES ('+
    '  ?, ?, ?, NOW(), false'+
    ')',
    [email, userName, password],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

User.createByTwitter = function(params, next) {
  var client = app.set('mySqlClient');
  var provider = 'twitter';
  var id = params.id;
  var userName = params.userName;
  var image = params.image;
  var token = params.token;
  var tokenSecret = params.tokenSecret;

  client.query(
    'INSERT INTO users ('+
    ' provider, oauth_id, name, image, '+
    ' token, token_secret, '+
    ' created_at, `delete`'+
    ') VALUES ('+
    ' ?, ?, ?, ?, ?, ?, NOW(), false'+
    ')',
    [provider, id, userName, image, token, tokenSecret],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

User.update = function(params, next) {
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var userName = params.userName;
  var email = params.email;

  client.query(
    'UPDATE users SET'+
    ' name = ?, email = ?'+
    ' WHERE id = ? AND `delete` = false',
    [userName, email, userId],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

User.updateTwitterImage = function(params, next) {
  var client = app.set('mySqlClient');
  var id = params.id;
  var image = params.image;

  client.query(
    'UPDATE users SET'+
    ' image = ?'+
    ' WHERE oauth_id = ? AND `delete` = false',
    [image, id],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

exports.User = User;
