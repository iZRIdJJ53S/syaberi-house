var app = require('../../app');
var logger = app.set('logger');


function Category() {
  this.client = app.set('mySqlClient');
}

Category.find = function(next) {
  var client = app.set('mySqlClient');

  client.query(
    'SELECT id, title'+
    ' FROM category'+
    ' WHERE `delete` = false'+
    ' ORDER BY rank ASC',
    function(err, results) {
      if (err) {throw err;}
      next(null, results);
    }
  );
};


exports.Category = Category;
