var base = require('./base');

function User() {
  this.client = base.initDB();
}

User.findOne = function(email, password, next) {
  var client = base.initDB();

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
  var client = base.initDB();

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
  var client = base.initDB();

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
  var client = base.initDB();
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
  var client = base.initDB();
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

exports.User = User;
