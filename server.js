var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require('./db/user.js');

var app = express();

passport.use(new localStrategy({
	passReqToCallback: true,
	},
	function(username, password, done) {
		User.findByUsername({username: username}, function(err, user) {
			if(err)
				return done(err);
			if(!user)
				return done(null, false, {message: 'Incorrect username.'});
			if(!user.validPassword(password))
				return done(null, false, {message: 'Incorrect password.'});
			return done(null, user);
		});
	}
));

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret: 'make this more secure later',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('*', function(req, res) {
	res.status(404).send();
});

app.listen(3000);