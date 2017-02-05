var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret: 'make this more secure later',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get('*', function(req, res) {
	res.status(404).send();
});

app.listen(3000);