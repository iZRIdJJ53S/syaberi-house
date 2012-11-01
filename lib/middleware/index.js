var app = module.parent.exports;
var logger = app.set('logger');


exports.sessionData = function(req, res, next) {
  app.locals.isAuth = req.isAuthenticated();
  if (req.isAuthenticated()) {
    app.locals.userId = req.user.id;
    app.locals.userName = req.user.name;
    app.locals.userImage = req.user.image;
  }
  next();
};

