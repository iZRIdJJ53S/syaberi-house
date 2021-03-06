/*******************************
 * メール送信関連処理
 ******************************/


var app = require('../../app');
var config = require('config');
var ejs = require('ejs');
var fs = require('fs');
var emailjs  = require('emailjs/email');


var Mail = function() {
};


// 共通メール送信処理
Mail.prototype.send = function(params) {
  var mailServer = app.set('mailServer');
  var logger = app.set('logger');

  var template = params.template;

  fs.readFile(template, "utf8", function(err, tmpl) {
    params.data.filename = __dirname+'/../../views';
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

// 入会時のメール送信
Mail.prototype.sendWelcomeMail = function(userName, to) {
  var template = __dirname+'/../../views/mail/welcome.ejs';
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

// 退会時のメール送信
Mail.prototype.sendDeactivationMail = function(userName, to) {
  var template = __dirname+'/../../views/mail/deactivation.ejs';
  var subject = config.mail.subject.deactivation;
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

// プロフィール更新時のメール送信
Mail.prototype.sendProfileMail = function(userName, to) {
  var template = __dirname+'/../../views/mail/profile.ejs';
  var subject = config.mail.subject.profile;
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
