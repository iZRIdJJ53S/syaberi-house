/*******************************
 * 自作のユーティリティ関数集
 ******************************/


var app = require('../../app');
var util = require('util');


//改行コードをbrタグに変換
exports.nl2br = function(str) {
  if (str) {
    return str.replace(/\n/g, '<br/>');
  }
};

//HTMLエスケープ処理
exports.escHtml = function(str) {
  if (str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/\\/g, '&yen;');
    return str;
  }
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

// Error
// 401 用のエラー
// リクエストされた URI を受け取ることができる。
function Unauthorized(path) {
  Error.call(this, 'Not Found');
  Error.captureStackTrace(this, this.constructor); // スタックトレースの格納
  this.name = 'Unauthorized';
  this.path = path;
}
util.inherits(Unauthorized, Error);

exports.Unauthorized = Unauthorized;


// URLかどうかの判定
function isUrl(text) {
  if (text.length == 0) {
    return false;
  }
  text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=:;_]*)?)/);

  if (RegExp.$1 != null && RegExp.$1.length > 0) {
    return true;
  }
  return false;
}
exports.isUrl = isUrl;


// URLの取得
function getUrl(text) {
  if (text.length == 0) {
    return false;
  }
  text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=:;_]*)?)/);

  if (RegExp.$1 != null && RegExp.$1.length > 0) {
    return RegExp.$1;
  }
  return false;
}
exports.getUrl = getUrl;


// 画像URLの判定
function isImageUrl(url) {
  if (url.length == 0) {
    return false;
  }

  if (url.match(/(\.(jpg|jpeg|gif|png)$)/i)) {
    return true;
  }
  return false;
}
exports.isImageUrl = isImageUrl;


// Youtube の判定
function isYoutube(url) {
  if (url.length == 0) {
    return false;
  }

  if (url.indexOf('youtube.com')) {
    return true;
  }
  return false;
}
exports.isYoutube = isYoutube;


// Youtube の動画ID取得
function getYoutubeVid(url) {
  if (url.length == 0) {
    return false;
  }
  var youtube_vid = url.match(/[&\?]v=([\d\w-]+)/);
  if (youtube_vid[1]) {
    return youtube_vid[1];
  }
  return false;
}
exports.getYoutubeVid = getYoutubeVid;


