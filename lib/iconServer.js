// country.js
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

exports.getCountryList = function(req, res) {
	fs.readdir(path.join(__dirname, "..", "public", "images", "flag_icons", "24"), function(err, files) {
		if(err) {
			console.log(err.toString());
			res.status(404).send();
		}
		else {
			var retVal = {countries: []};
			_.each(files, function(file) {
				retVal.countries.push(file.replace(".png",""));
			});
			res.send(retVal);
		}
	});
};

exports.getInstrumentList = function(req, res) {
	fs.readdir(path.join(__dirname, "..", "public", "images", "musicons", "24"), function(err, files) {
		if(err) {
			console.log(err.toString());
			res.status(404).send();
		}
		else {
			var retVal = {instruments: []};
			_.each(files, function(file) {
				retVal.instruments.push(file.replace(".png",""));
			});
			res.send(retVal);
		}
	});
};