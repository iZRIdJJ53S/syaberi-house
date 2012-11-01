var app = require('../../app');


function Category() {
  this.client = app.set('mySqlClient');
}

Category.find = function(next) {
  var logger = app.set('logger');
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, title'+
    ' FROM category'+
    ' WHERE `delete` = false'+
    ' ORDER BY rank ASC',
    function(err, results) {
      if (err) { return next(err); }
      return next(null, results);
    }
  );
};


exports.Category = Category;
