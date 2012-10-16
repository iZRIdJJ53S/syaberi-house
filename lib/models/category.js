var base = require('./base');

function Category() {
  this.client = base.initDB();
}

Category.find = function(next) {
  var client = base.initDB();

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
