var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function(req, res) {
	res.send("CloudNotation");
});

app.listen(3000);