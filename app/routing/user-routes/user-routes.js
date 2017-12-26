const User = require('../../models/user');

module.exports = function(api) {

  // IS USERNAME AVAILABLE

  api.get('/is-username-available', isUsernameAvailable);

  // GET USER

  api.get('/user', getUser);

  // REMOVE USER

  api.delete('/user', function(req, res) {
  	User.removeUser(req.query.username, function(err, mongoRes) {
  		let response;
  		if (err) {
  			response = err;
  		}
  		else if (mongoRes.result) {
  			response = mongoRes.result;
  		}
  		else {
  			response = 'unknown error';
  		}
  		res.json(response);
  	});
  });

}

function getUser(req, res) {
  var user = null;
  if (req.user) {
    user = req.user.username;
  }
  res.send(user);
}

function isUsernameAvailable(req, res, next) {
  let username;
  if (req.query && req.query.username) {
    username = req.query.username;
  }
  User.getUserByUsername(username, function(err, user) {
    if (err) {
      res.status(500);
      res.json(err);
    }
    const result = user ? false : true;
    res.send(result);
  });
}

//export functions for testing

module.exports.getUser = getUser;
module.exports.isUsernameAvailable = isUsernameAvailable;
