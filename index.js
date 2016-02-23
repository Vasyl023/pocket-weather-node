var express = require('express');
var app = express();



var server = app.listen(9000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server listening at http://%s:%s', host, port)
});