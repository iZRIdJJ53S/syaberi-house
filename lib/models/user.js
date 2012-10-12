var base = require('./base');

function User() {
  this.client = base.initDB();
}

User.prototype.create = function(params, next) {
  var self = this;
  var email = params.email;
  var userName = params.userName;
  var password = params.password;

  self.client.query(
    'INSERT INTO users ('+
    '  email, name, password, created_at'+
    ') VALUES ('+
    '  ?, ?, ?, NOW()'+
    ')',
    [email, userName, password],
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};

exports.User = User;
