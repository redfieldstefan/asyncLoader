'use strict';

var bodyParser = require('body-parser');
var url = require('url');
var fs = require('fs');

module.exports = function(router) {
  router.use(bodyParser.json());

  router.post('/upload', function(req, res) {
    console.log(req.body);//Empty
    console.log(req.files);//Empty
  });

};
