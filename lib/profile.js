// profile.js
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var _ = require('underscore');
var globals = require('../globals.js');

exports.getProfile = function(req, res) {
	if(req.user && !_.isUndefined(req.user.id)) {
		mongoClient.connect(globals.dbUrl, function(err, db) {
			db.open();
			if(err) {
				res.status(500).send();
			}
			var collection = db.collection("profiles");
			collection.findOne({userId: new mongodb.ObjectId(res.user.id)}, function(err, doc) {
				db.close();
				if(err) {
					console.log("Error finding user: "+err.toString());
					res.status(500).send();
				}
				if(doc) {
					res.send(doc);
				}
				res.status(404).send();
			});
		});
	}
};

exports.postProfile = function(req, res) {
	if(req.user && !_.isUndefined(req.user.id)) {
		if(_.isObject(req.body)){
			var age;
			var city;
			var state;
			var country;
			var instrument;
			var genre;
			var artist;
			if(_.isNumber(req.body.age) && age > 0 && age < 130) {
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
			mongoClient.connect(globals.dbUrl, function(err, db) {
				db.open();
				if(err) {
					res.status(500).send();
				}
				var collection = db.collection("profiles");
				collection.findOne({userId: req.user.id}, function(err, doc) {
					console.log("enter registerUser after collection findOne");
					if(err){
						console.log(err.toString() + " blah");
						db.close();
						return res.status(500).send();
					}
					if(!doc) {
						collection.insertOne({userId:req.user.id, age:age, city:city, state:state, country:country, instrument:instrument,
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
						collection.updateOne({userId:req.user.id}, {age:age, city:city, state:state, country:country, instrument:instrument,
							genre:genre, artist:artist}, function(err) {
							db.close();
							if(err) {
								console.log(err.toString());
								return res.status(500).send();
							}
							return res.send();
						});
					}
				});
			});
		}
	}
};