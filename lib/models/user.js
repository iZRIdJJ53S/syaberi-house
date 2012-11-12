/*********************************************************
 * ユーザーに関連するDBアクセス処理
 *********************************************************/


var app = require('../../app');


function User() {
  this.client = app.set('mySqlClient');
}

//メールアドレスとパスワードの組み合わせでユーザー情報を取得する処理
//(オリジナルアカウント管理が無くなった為現在は未使用)
User.findOne = function(email, password, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email FROM users'+
    ' WHERE email = ? AND password = ? AND `delete` = false',
    [email, password],
    function(err, results) {
      if (err) { return next(err); }
      if (results.length > 0) {
        return next(null, results[0]);
      }
      else {
        return next(null, null);
      }
    }
  );
};

//TwitterのIDでユーザー情報を取得する処理
User.findOneByTwitter = function(id, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email, image FROM users'+
    ' WHERE oauth_id = ? AND `delete` = false',
    [id],
    function(err, results) {
      if (err) { return next(err); }
      if (results.length > 0) {
        return next(null, results[0]);
      }
      else {
        return next(null, null);
      }
    }
  );
};


//IDでユーザー情報を取得する処理
User.findOneById = function(id, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, name, email, image, description FROM users'+
    ' WHERE id = ? AND `delete` = false',
    [id],
    function(err, results) {
      if (err) { return next(err); }
      if (results.length > 0) {
        return next(null, results[0]);
      }
      else {
        return next(null, null);
      }
    }
  );
};


//メールアドレスとパスワードでユーザーを新規作成する処理
//(オリジナルアカウント管理が無くなった為現在は未使用)
User.create = function(params, next) {
  var logger = app.set('logger');
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
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};


//Twitter認証でユーザーを新規作成する処理
User.createByTwitter = function(params, next) {
  var logger = app.set('logger');
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
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//ユーザー情報の更新処理
User.update = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var userId = params.userId;
  var userName = params.userName;
  var email = params.email;
  var description = params.description;

  client.query(
    'UPDATE users SET'+
    ' name = ?, email = ?, description = ?'+
    ' WHERE id = ? AND `delete` = false',
    [userName, email, description, userId],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//ログイン時にTwitterのプロフィール画像を更新する処理
User.updateTwitterImage = function(params, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');
  var id = params.id;
  var image = params.image;

  client.query(
    'UPDATE users SET'+
    ' image = ?'+
    ' WHERE oauth_id = ? AND `delete` = false',
    [image, id],
    function(err, results) {
      if (err) { return next(err);}
      return next(null, results);
    }
  );
};

//ユーザーの退会を実行する処理
User.deactivate = function(userId, next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'UPDATE users SET'+
    ' `delete`=true'+
    ' WHERE id = ?',
    [userId],
    function(err, results) {
      if (err) { return next(err);}
      return next(null);
    }
  );
};

exports.User = User;
