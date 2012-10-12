var config = require('config');
var mysql = require('mysql');

exports.initDB = function() {
  var client = mysql.createClient({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
  });
  return client;
}


