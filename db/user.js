var records = [
	{id: 1, username: 'andrew', password: 'isabelle', displayName: 'Andrew', emails: [ {value: 'andrew@andrew.com'}]},
	{id: 1, username: 'isabelle', password: 'andrew', displayName: 'Isabelle', emails: [ {value: 'isabelle@isabelle.com'}]}
];

exports.findById = function(id, callback) {
	process.nextTick(function() {
		var idx = id - 1;
		if(records[idx]) {
			callback(null, records[idx]);
		}
		else {
			callback(new Error('User '+id+' does not exist'));
		}
	});
};

exports.findByUsername = function(username, callback) {
	process.nextTick(function() {
		for(var i=0; i< records.length; i++) {
			if(records[i].username === username) {
				return callback(null, records[i]);
			}
		}
		return callback(null, null);
	});
};