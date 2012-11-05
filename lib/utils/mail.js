var app = require('../../app');
var config = require('config');
var ejs = require('ejs');
var fs = require('fs');
var emailjs  = require('emailjs/email');


var Mail = function() {
};


Mail.prototype.send = function(params) {
  var mailServer = app.set('mailServer');
  var logger = app.set('logger');

  var template = params.template;

  fs.readFile(template, "utf8", function(err, tmpl) {
    var renderResult = ejs.render(tmpl, params.data);
    mailServer.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: renderResult
    }, function(err, msg) {
      if (err) { return logger.error(err); }
      return logger.info(msg);
    });
  });
};

Mail.prototype.sendWelcomeMail = function(userName, to) {
  var template = __dirname+'/../../views/email/welcome.ejs';
  var subject = config.mail.subject.welcome;
  var from = config.mail.from;

  this.send({
    from: from,
    to: to,
    subject: subject,
    template: template,
    data: {
      userName: userName
    }
  });
};


exports.Mail = Mail;
