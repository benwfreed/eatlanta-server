var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var includes = require('array-includes');

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: String,
	visits: [Number],
	comments: [Number]
});

var User = mongoose.model('User', userSchema);

module.exports.addUser = function(user, callback) {
	if (!user.username || !user.password) {
		const missing = !user.username ? 'username' : 'password';
		const err = {
			message: 'missing ' + missing
		}
		callback(err);
		return;
	}
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {console.log(err);}
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {console.log(err);}
			user.password = hash;
			User.create(user, callback);
		});
	});
};

module.exports.removeUser = function(username, callback) {
	User.remove({username: username}, callback);
}

module.exports.removeUsers = function(query, callback) {
	User.remove(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
};

module.exports.visit = function(username, locationId, callback) {
	User.update({username: username}, {$push: {visits: locationId}}, callback);
};

module.exports.getUserByUsername = function(username, callback) {
	User.findOne({username: username}, callback);
};

module.exports.getUserByEmail = function(email, callback) {
	User.findOne({email: email}, callback);
};

module.exports.hasVisited = function(username, locationId, callback) {
	User.findOne({username: username}, function(err, user) {
		if (user) {
			const hasVisited = includes(user.visits, locationId);
			console.log('visits: ', user.visits, ' locationID: ', locationId);
			callback(err, hasVisited);
		} else {
			callback(err, false);
		}
	});
};

module.exports.comment = function(username, locationId, callback) {
	console.log(username, locationId);
	User.update({username: username}, {$push: {comments: locationId}}, callback);
};

module.exports.hasCommented = function(username, locationID, callback) {
	User.findOne({username: username}, function(err, user) {
		if (user) {
			const hasCommented = includes(user.comments, locationID);
			callback(err, hasCommented);
		} else {
			callback(err, false);
		}
	});
};

module.exports.pullComment = function(username, locationId, callback) {
	User.update({username: username}, { $pull: {comments: locationId}}, callback);
}
