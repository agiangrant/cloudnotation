// authentication.js
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcryptjs');

var config;

fs.readFile(path.join(__dirname, "authConfig.json"), {encoding: "utf8"}, (err, data) => {
    if(err)
        throw err;
    config = JSON.parse(data);
});

module.exports = function(req, res, next) {
    if(_.isObject(req) && _.isString(req.path) && _.isString(req.method) &&
        (req.path === "/login" || req.path === "/register") && req.method === "POST") {
        if(req.path === "/login")
            login(req, res);
        else if(req.path === "/register")
            register(req, res);
    }
    else {
        next();
    }
};

function login(req, res) {
    if(!_.isObject(req.body) || (_.isObject(req.body) && (!_.isString(req.body.username) ||
     !_.isString(req.body.password)) ) ) {
        return res.status(400).send();
    }
    // commence login sequence
    if(_.isString(config.db)) {
        mongoClient.connect(config.db, function(err, db) {
            db.open();
            if(err) {
                console.log(err.toString());
                db.close();
                return res.status(500).send();
            }
            var collection = db.collection("users");
            collection.findOne({username: req.body.username}, function(err, doc) {
                db.close();
                if(err) {
                    console.log(err.toString());
                    return res.status(500).send();
                }
                if(doc) {
                    if(doc.username === req.body.username && bcrypt.compareSync(req.body.password, doc.password)) {
                        var accessToken = jwt.sign({
                            data: {username: req.body.username}
                        }, "secret", {expiresIn: 60*60});
                        return res.send({access_token: accessToken});
                    }
                }
                return res.send({message: "Incorrect Username or Password."});
            });
        });
    }
}

function register(req, res) {
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
                return res.send({message: message});
            }
        }
    }
    mongoClient.connect(config.db, function(err, db) {
        db.open();
        if(err) {
            console.log(err.toString());
            db.close();
            return res.status(500).send();
        }
        var collection = db.collection("users");
        collection.findOne({username: req.body.username}, function(err, doc) {
            if(err){
                console.log(err.toString() + " blah");
                db.close();
                return res.status(500).send();
            }
            if(!doc) {
                var passwordSalt = bcrypt.genSaltSync(11);
                var password = bcrypt.hashSync(req.body.password, passwordSalt);
                collection.insertOne({username: req.body.username, password: password,
                    firstName: req.body.firstName, lastName: req.body.lastName}, function(err) {
                    db.close();
                    if(err) {
                        console.log(err.toString() + "blah2");
                        return res.status(500).send();
                    }
                    res.send();
                });
            }
            else {
                db.close();
                return res.send({message: "Email address is already being used."});
            }
        });
    });
}