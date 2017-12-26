const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const userRoutes = require('./user-routes');
const httpMocks = require('node-mocks-http');

const User = require('../../models/user');

var response;
var request;

beforeEach(function() {

    request  = httpMocks.createRequest({
          method: 'GET',
          url: '/user',
    });

    request.user = {
      username: 'testuser1'
    };

    response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
});

describe('User Routes', function() {

  it('should return the currently logged in user', function(done) {
    response.on('end', function() {
      expect(response._getData()).equal(request.user.username);
      done();
    });

    userRoutes.getUser(request, response);

  });

  it('should return true when a username is available', function(done) {
    response.on('end', function() {
      expect(response._getData()).equal('true');
      done();
    });

    request.url = 'is-username-available';
    request.query = {
      username: 'noUserWithThisName'
    }

    userRoutes.isUsernameAvailable(request, response);

  });

  it('should return false when a username is unavailable', function(done) {
    response.on('end', function() {
      // since response body is equal to false, the
      // implementation of _getData() returns undefined
      expect(response._getData()).to.not.equal('true');
      done();
    });

    request.url = 'is-username-available';
    request.query = {
      username: 'testuser1'
    }

    const user = {
      username: 'testuser1',
      password: 'password123'
    };

    User.addUser(user, function(err, user) {
      userRoutes.isUsernameAvailable(request, response);
    });
  });


  after(function(done) {
    User.removeUsers({}, function(err) {
      if (err) {
        console.log('error removing a test user from db ', err);
      }
      done();
    });
  });
  
});
