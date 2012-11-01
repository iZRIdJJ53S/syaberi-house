var app = require('../../app');
var logger = app.set('logger');
var formidable = require('formidable');
var fs = require('fs');


exports.upload = function (req, res) {
  var form = new formidable.IncomingForm();
  var files = [];
  var fields = [];
  var decImage2 = req.body.dec_image2;

  //ファイル保存場所
  var uploadDir= __dirname + '/public/uploads';

  if(req.files){
    //ファイル名をtmpのままにする
    var uploadDirTwo = req.files.dec_image2.path.split('/');
    var filenamePerse = uploadDir + '/' + uploadDirTwo[2] + '.jpg';
    var filenameReturn = uploadDirTwo[2] + '.jpg';

    fs.rename(req.files.dec_image2.path, filenamePerse);
    console.log(filenameReturn);

    res.json({filename: filenameReturn},200)
  }

  form.uploadDir = uploadDir;

  form
    .on('field', function(field, value) {
      fields.push([field, value]);
    })
    .on('file', function(field, file) {
      fs.rename(file.path, file.path + '.jpg');
      files.push([field, file]);
    })
    .on('end', function() {
      var tmpPath = files[0][1].path.split('/');
      res.send({'status': 'File was uploaded successfuly!',
        'filename': '/uploads/' + tmpPath[8] + '.jpg'
      });
    });

  form.parse(req, function(err, fields, files) {
  });
  return;
};



