const expect = require('chai').expect;
const User = require('./user');

var mongoose = require('mongoose');

const uri = process.env.MONGO_TESTING_URI || 'mongodb://mongodb/eatlanta-test';

mongoose.Promise = require('bluebird');

mongoose.connect(uri, {
	useMongoClient: true
});

describe('User Model', function() {

  it('should add a user', function(done) {
    const testUser ={
      username: 'testuser1',
      password: 'password123'
    };
    User.addUser(testUser, function(err, user) {
      if (err) {
        console.log('there was an error ', err);
      } else {
        expect(user.username).equal('testuser1');
      }
      done();
    });
  });

  it('should not add a user without a username', function(done) {
    const testUser = {
      password: 'password123'
    };
    User.addUser(testUser, function(err, user) {
      expect(err.message).equal('missing username');
      expect(user).to.be.undefined;
      done();
    });
  });

  it('should not add a user without a password', function(done) {
    const testUser = {
      username: 'testuser1'
    };
    User.addUser(testUser, function(err, user) {
      expect(err.message).equal('missing password');
      expect(user).to.be.undefined;
      done();
    });
  });

  it('should find a user based on password', function(done) {
    const testUser ={
      username: 'testuser2',
      password: 'password123'
    };
    User.addUser(testUser, function(err, user) {
      if (err) {
        console.log('there was an error ', err);
      } else {
        expect(user.username).equal('testuser2');
      }
      done();
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
