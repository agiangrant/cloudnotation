var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var globals = require('../globals.js');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

exports.findById = function(id, callback) {
	process.nextTick(function() {
		mongoClient.connect(globals.dbUrl, function(err, db) {
			db.open();
			if(err) {
				console.log(err.toString());
				db.close();
				return callback(err, null);
			}
			var collection = db.collection("users");
			collection.findOne({_id: new mongodb.ObjectId(id)}, function(err, doc) {
				db.close();
				if(err) {
					console.log("Error finding user: "+err.toString());
					return callback(err, null);
				}
				if(doc) {
					return callback(null, doc);
				}
				return callback(null, null);
			});
		});
	});
};

exports.findByUsername = function(username, password, callback) {
	process.nextTick(function() {
		console.log("enter findByUsername");
		mongoClient.connect(globals.dbUrl, function(err, db) {
			db.open();
			console.log("enter findByUsername mongoClient connect");
			if(err) {
				console.log(err.toString());
				db.close();
				return callback(err, null, {message: 'An internal server error occurred.'});
			}
			var collection = db.collection("users");
			collection.findOne({username: username}, function(err, doc) {
				console.log("findByUsername collection findOne");
				db.close();
				if(err) {
					console.log(err.toString());
					return callback(err, null, {message: 'An internal server error occurred.'});
				}
				if(doc) {
					if(doc.username == username && bcrypt.compareSync(password, doc.password)) {
						console.log("successful findByUsername");
						return callback(null, doc);
					}
					console.log("hit after findone");
					return callback(null, null, {message: "Incorrect Password."});
				}
				return callback(null, null, {message: "Incorrect Username or Password."});
			});
		});
	});
};

exports.registerUser = function(req, res) {
	if(!_.isObject(req.body)) {
		return res.status(400).send({error: "Please fill out required fields."});
	}
	else {
		var message = "";
		if(!_.isString(req.body.username)) {
			message += "Please enter an email address.\r\n";
		}
		else if(req.body.username.search(/^..*@..*\...*$/)) {
			message += "Please enter a valid email address.\r\n";
		}
		if(!_.isString(req.body.password)) {
			message += "Please enter a password.\r\n";
		}
		else {
			if(req.body.password.search(/[A-Z]/) === -1) {
				message += "Password must contain at least one uppercase character.\r\n";
			}
			if(req.body.password.search(/[a-z]/) === -1) {
				message += "Password must contain at least one lowercase character.\r\n";
			}
			if(req.body.password.search(/[0-9]/) === -1) {
				message += "Password must contain at least one number.\r\n";
			}
			if(req.body.password.length < 6) {
				message += "Password must be more than 6 characters in length.\r\n";
			}
			if(req.body.password.length > 255){
				message += "Password must be less than 255 characters in length.\r\n";
			}
			// fix this later
			if(!_.isString(req.body.firstName) || (_.isString(req.body.firstName) && req.body.firstName.length < 1)) {
				message += "Please enter first name.\r\n";
			}
			if(!_.isString(req.body.lastName) || (_.isString(req.body.lastName) && req.body.lastName.length < 1)) {
				message += "Please enter last name.\r\n";
			}
			if(req.body.passwordConfirm !== req.body.password) {
				message += "Confirm password and password do not match.\r\n";
			}
			if(message.length > 0) {
				return res.render('login',{signupError: message});
			}
			register(req, res);
		}
	}
};

function register(req, res) {
	process.nextTick(function() {
		mongoClient.connect(globals.dbUrl, function(err, db) {
			db.open();
			if(err) {
				console.log(err.toString());
				db.close();
				return res.status(500).send();
			}
			console.log("enter registerUser before collection");
			var collection = db.collection("users");
			collection.findOne({username: req.body.username}, function(err, doc) {
				console.log("enter registerUser after collection findOne");
				if(err){
					console.log(err.toString() + " blah");
					db.close();
					return res.render('login',{signupError: "An internal server error has occurred.  Please try your request later."});
				}
				if(!doc) {
					var passwordSalt = bcrypt.genSaltSync(11);
					var password = bcrypt.hashSync(req.body.password, passwordSalt);
					collection.insertOne({username: req.body.username, password: password,
						firstName: req.body.firstName, lastName: req.body.lastName}, function(err) {
						if(err) {
							console.log(err.toString() + "blah2");
							db.close();
							return res.render('login',{signupError: "An internal server error has occurred. Please try your request later."});
						}
						console.log('created user');
						res.render('login', {signupSuccess: "Your account has been created.  You may login now."});
					});
				}
				else {
					db.close();
					return res.render('login', {error: "Email address is already being used."});
				}
			});
		});
	});
}