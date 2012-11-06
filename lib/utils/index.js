var app = require('../../app');
var util = require('util');


exports.nl2br = function(str) {
  return str.replace(/\n/g, '<br/>');
};

exports.escHtml = function(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/\\/g, '&yen;');
    return str;
};

// Error
// 404 用のエラー
// リクエストされた URI を受け取ることができる。
function NotFound(path) {
  Error.call(this, 'Not Found');
  Error.captureStackTrace(this, this.constructor); // スタックトレースの格納
  this.name = 'NotFound';
  this.path = path;
}
util.inherits(NotFound, Error);

exports.NotFound = NotFound;
