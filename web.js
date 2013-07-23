var express = require('express');

var app = express.createServer(express.logger());

// Amit
//https://github.com/visionmedia/express/blob/master/examples/static-files/index.js
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/bootstrap/css'));
app.use(express.static(__dirname + '/custom_css'));
app.use(express.static(__dirname + '/custom_js'));
app.use(express.static(__dirname + '/bootstrap/js'));
app.use(express.static(__dirname + '/bootstrap_x/js'));

var fs = require('fs');
var buf = fs.readFileSync('./index.html');

app.get('/', function(request, response) {
  //response.send('Hello World2!');
  response.send(buf.toString());
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
