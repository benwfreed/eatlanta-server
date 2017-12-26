const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const authRoutes = require('./auth-routes');
const httpMocks = require('node-mocks-http');
// const mongoose = require('mongoose');

// const uri = process.env.MONGO_TESTING_URI || 'mongodb://mongodb/eatlanta-test';

// mongoose.Promise = require('bluebird');

// mongoose.connect(uri, {
// 	useMongoClient: true
// });

const User = require('../../models/user');

var response = {
  status: function() {}
};
var request;

beforeEach(function() {
    request = httpMocks.createRequest({
          method: 'POST',
          url: '/register',
          body: {
            username: 'testuser1',
            password: 'password123'
          }
    });

    request.login = function() {};

    response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    response.status = function() {};
});

describe('Auth Routes', function() {


  it('should register a user', function(done) {
    response.on('end', function() {
      expect(JSON.parse(response._getData()).user).equal(request.body.username);
      done();
    });

    authRoutes.register(request, response);
  });

  it('should not register a user witout a username', function(done) {
    delete request.body.username;

    response.on('end', function() {
      expect(JSON.parse(response._getData()).message).equal('missing credentials');
      expect(response.status).equal(400);
      done();
    });

    authRoutes.register(request, response);
  });

  it('should not register a user witout a password', function(done) {
    delete request.body.password;

    response.on('end', function() {
      expect(JSON.parse(response._getData()).message).equal('missing credentials');
      expect(response.status).equal(400);
      done();
    });

    authRoutes.register(request, response);
  });

  it('should not log in a user without a username', function(done) {
    delete request.body.username;

    response.on('end', function() {
      expect(JSON.parse(response._getData()).message).equal('missing credentials');
      expect(response.status).equal(400);
      done();
    });

    authRoutes.login(request, response);
  });

  it('should not log in a user without a password', function(done) {
    delete request.body.username;

    response.on('end', function() {
      expect(JSON.parse(response._getData()).message).equal('missing credentials');
      expect(response.status).equal(400);
      done();
    });

    authRoutes.login(request, response);
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
