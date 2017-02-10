var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var globals = require('../globals.js');
var bcrypt = require('bcryptjs');

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
	process.nextTick(function() {
		console.log('trying to create user');
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
					return res.status(500).send();
				}
				if(!doc) {
					var passwordSalt = bcrypt.genSaltSync(11);
					var password = bcrypt.hashSync(req.body.password, passwordSalt);
					collection.insertOne({username: req.body.username, password: password}, function(err) {
						if(err) {
							console.log(err.toString() + "blah2");
							db.close();
							return res.status(500).send();
						}
						console.log('created user');
						res.redirect('/registerSuccess');
					});
				}
				res.redirect('/login');
			});
		});
	});
};