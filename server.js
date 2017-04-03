var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
//var User = require('./db/user.js');
var globals = require('./globals.js');
var authentication = require('./lib/auth/authentication.js');
var _ = require('underscore');

var Profile = require('./lib/profile.js');
var iconServer = require('./lib/iconServer.js');

var app = express();
var http = require('http').Server(app);
//require('./lib/chat.js')(http);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSession({
	secret: 'make this more secure later',
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		url: globals.dbUrl,
		touchAfter: 24*60*60
	}),
	cookie: {
		httpOnly: true,
		secure: true
	}
}));

app.use(authentication);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "node_modules", "socket.io-client", "lib")));
app.use(express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
app.use(express.static(path.join(__dirname, "node_modules", "jquery", "dist")));

app.get('/', function(req, res) {
	if(_.isObject(req.cookies) && _.isString(req.cookies.access_token)) {
		res.sendFile(path.join(__dirname, 'frontend-app', 'dist', 'index.html'));
	}
	else {
		res.sendFile(path.join(__dirname, 'views', 'login.html'));
	}
});

app.get('/login', function(req, res) {
	console.log(JSON.stringify(req.session));
	res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/profile', Profile.getProfile);
app.post('/profile', Profile.postProfile);

app.get('/countries', iconServer.getCountryList);
app.get('/instruments', iconServer.getInstrumentList);

app.post('/logout', function(req, res) {
	if(req.session !== null || req.session !== undefined) {
		req.session = null;
	}
	res.sendFile(path.join(__dirname, "views", "login.html"));
});

// needs to be before the catch all or the angular app will return 404
app.use(express.static(path.join(__dirname, 'frontend-app', 'dist')));

app.get('*', function(req, res) {
	res.status(404).send();
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log("Server listening at localhost:"+port);
});