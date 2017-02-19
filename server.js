var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require('./db/user.js');
var globals = require('./globals.js');

var Profile = require('./lib/profile.js');
var iconServer = require('./lib/iconServer.js');

var app = express();

passport.use(new localStrategy(
	function(username, password, done) {
		User.findByUsername(username, password, function(err, user, message) {
			return done(err, user, message);
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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "views", "css")));
app.use(express.static(path.join(__dirname, "views", "javascript")));
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
	})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/profile', Profile.getProfile);
app.post('/profile', Profile.postProfile);

app.get('/countries', iconServer.getCountryList);
app.get('/instruments', iconServer.getInstrumentList);


app.get('/', function(req, res) {
	console.log(req.user);
	if(req.user)
		res.render('index', req.user);
	else
		res.redirect('login');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if(err) 
			return next(err);
		if(!user)
			return res.render("login", info);
		req.login(user, function(err) {
			if(err)
				console.log(err.toString());
			return res.redirect('/');
		});
	})(req, res, next);
});

app.post('/register', User.registerUser);

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('*', function(req, res) {
	res.status(404).send();
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server listening at localhost:"+port);
});