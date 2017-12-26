const User = require('../../models/user');
const passport = require('passport');

const errorHandler = require('../middleware-error-handler');

module.exports = function(api) {

  // REGISTER

  api.post('/register', register);

  // LOGIN

  api.post('/login', login);

  // LOGOUT

  api.get('/logout', function(req, res) {
  	var message = 'No user was logged in';
  	if (req.user) {
  		var username = req.user.username;
  		req.logout();
  		message =  username + ' successfully logged out.';
  	}
  	return res.json({
  		user: false,
  		message: message
  	});
  });

}

function login(req, res, next) {
  const loginError = errorHandler(res, 'there was an error authenticating the user', 500);
  if (!req.body.username || !req.body.password) {
    loginError('missing credentials', 400);
  }
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      loginError(null, null, err);
    }
    if (!user) {
      res.status(401);
      res.json(info);
    }
    else {
      req.logIn(user, function(err) {
        if (err) {
          loginError(null, null, err);
        }
        if (req.user && req.user.permissions) {var permissions = req.user.permissions;}
        res.json({user: user.username, permissions: permissions});
      });
    }
  })(req, res, next);
}

function register(req, res, next) {
  const registerError = errorHandler(res, 'there was an error registering the user', 500);
  if (!req.body.username || !req.body.password) {
    registerError('missing credentials', 400);
    return;
  }
  User.getUserByUsername(req.body.username, function(err, user) {
    if (err) {
      registerError('there was an error querying by username', 500, err);
    }
    var sameName = false;
    if (user) {
      sameName = true;
    }
    User.getUserByEmail(req.body.email, function(err, user) {
      if (err) {
        registerError('there was an error querying by password', 500, err);
      }
      var sameEmail = false;
      if (user && user.email) {
        sameEmail = true;
      }
      var validRegistration = !(sameName || sameEmail);
      if (validRegistration) {
        var newUser = {
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        };
        User.addUser(newUser, function(err, user) {
          if (err) {
            registerError('there was an error adding the user', 500, err);
          }
          req.login(user, function(err) {
            if (err) {
              registerError('there was an error loggin the user in after registration', 500, err);
            }
          });
          res.json({
            user: user.username
          });
        });
      } else {
            res.status(401);
            res.json({
              sameName: sameName,
              sameEmail: sameEmail,
              validRegistration: validRegistration
            });
      }
    });
  });
}

// export functions for testing
module.exports.login = login;
module.exports.register = register;
