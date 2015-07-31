'use strict';

var bodyParser = require('body-parser');
var fs = require('fs');
var Pluploader = require('node-pluploader');
var AWS = require('aws-sdk');
var accessKeyId = process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var pluploader = new Pluploader();

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

pluploader.on('fileUploaded', function(file, req) {
  var params = {
        Bucket: "asyncloader",
        Key: file.name,
        Body: file.data
  };

  s3.putObject(params, function (perr, pres) {
    if (perr) {
        console.log("Error uploading data: ", perr);
    } else {
        console.log("Successfully uploaded data to " + S3_BUCKET);
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
