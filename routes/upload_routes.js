'use strict';

var bodyParser = require('body-parser');
var url = require('url');
var fs = require('fs');
var Pluploader = require('node-pluploader');

var pluploader = new Pluploader();

var uploadDest = './uploads/'

pluploader.on('fileUploaded', function(file, req) {
  console.log(file);
  fs.writeFile(uploadDest + file.name, file.data, function(err) {
    if(err) {
      console.log(err);
    }
  });
});

pluploader.on('Error', function(err) {
  console.log("THIS IS HANDLING THE ERROR " + err);
});

module.exports = function(router) {
  router.use(bodyParser.json());

  router.post('/upload', function(req, res) {
    pluploader.handleRequest(req, res);
  });

};
