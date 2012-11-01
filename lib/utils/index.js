var app = require('../../app');
var logger = app.set('logger');


exports.nl2br = function(str) {
  return str.replace(/\n/g, '<br/>');
};

exports.escHtml = function(str) {
    str = str.replace('&', '&amp;');
    str = str.replace('<', '&lt;');
    str = str.replace('>', '&gt;');
    str = str.replace('"', '&quot;');
    str = str.replace('\\', '&yen;');
    return str;
};

