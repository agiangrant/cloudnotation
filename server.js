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

passport.use(new localStrategy(
	function(username, password, done) {
		User.findByUsername(username, function(err, user) {
			if(err)
				return done(err);
			if(!user)
				return done(null, false, {message: 'Incorrect username.'});
			if(user.password !== password)
				return done(null, false, {message: 'Incorrect password.'});
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, callback){
	callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
	User.findById(id, function (err, user) {
		if(err)
			return callback(err);
		callback(null, user);
	});
});


app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "views", "css")));
app.use(express.static(path.join(__dirname, "views", "javascript")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(expressSession({
	secret: 'make this more secure later',
	resave: false,
	saveUninitialized: false,
	cookie: {secure: true}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/login', function(req, res) {
	res.render('login', undefined);
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if(err) 
			return next(err);
		if(!user)
			return res.render("login", info);
		return res.redirect('/');
	})(req, res, next);
});

app.post('/register', User.registerUser);

app.get('*', function(req, res) {
	res.status(404).send();
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server listening at localhost:"+port);
});