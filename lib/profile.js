// profile.js
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var _ = require('underscore');
var globals = require('../globals.js');

exports.getProfile = function(req, res) {
	if(req.user && !_.isUndefined(req.user._id)) {
		mongoClient.connect(globals.dbUrl, function(err, db) {
			db.open();
			if(err) {
				return res.status(500).send();
			}
			var collection = db.collection("profiles");
			collection.findOne({_id: new mongodb.ObjectId(req.user._id)}, function(err, doc) {
				db.close();
				if(err) {
					console.log("Error finding user: "+err.toString());
					return res.status(500).send();
				}
				if(doc) {
					console.log("found user profile");
					return res.send(JSON.stringify(doc));
				}
				console.log("did not found user profile");
				return res.status(404).send();
			});
		});
	}
};

exports.postProfile = function(req, res) {
	if(req.user && !_.isUndefined(req.user._id)) {
		if(_.isObject(req.body)){
			var age;
			var city;
			var state;
			var country;
			var instrument;
			var genre;
			var artist;
			console.log(req.body.age);
			if(_.isString(req.body.age)) {
				age = req.body.age;
			}
			if(_.isString(req.body.city)) {
				city = req.body.city;
			}
			if(_.isString(req.body.state)) {
				state = req.body.state;
			}
			if(_.isString(req.body.country)) {
				country = req.body.country;
			}
			if(_.isString(req.body.instrument)) {
				instrument = req.body.instrument;
			}
			if(_.isString(req.body.genre)) {
				genre = req.body.genre;
			}
			if(_.isString(req.body.artist)) {
				artist = req.body.artist;
			}
			console.log(age);
			mongoClient.connect(globals.dbUrl, function(err, db) {
				db.open();
				if(err) {
					res.status(500).send();
				}
				var collection = db.collection("profiles");
				collection.findOne({_id: new mongodb.ObjectId(req.user._id)}, function(err, doc) {
					console.log("enter registerUser after collection findOne");
					if(err){
						console.log(err.toString() + " blah");
						db.close();
						return res.status(500).send();
					}
					if(!doc) {
						collection.insertOne({_id: req.user._id, age:age, city:city, state:state, country:country, instrument:instrument,
							genre:genre, artist:artist}, function(err) {
							db.close();
							if(err) {
								console.log(err.toString() + "blah2");
								return res.status(500).send();
							}
							console.log('created user');
							return res.send();
						});
					}
					else {
						console.log("going to update profile");
						collection.updateOne({_id: new mongodb.ObjectId(req.user._id)}, {age:age, city:city, state:state, country:country, instrument:instrument,
							genre:genre, artist:artist}, function(err) {
							db.close();
							if(err) {
								console.log(err.toString());
								return res.status(500).send();
							}
							console.log("profile update successful");
							return res.send();
						});
					}
				});
			});
		}
	}
};