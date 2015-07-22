'use strict';

var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static('public'));

var uploadRoutes = require('./routes/upload_routes');
var uploadRouter = express.Router();
uploadRoutes(uploadRouter);
app.use('/', uploadRouter);

app.listen(port, function() {
  console.log('Server started on ' + port + '.');
});
