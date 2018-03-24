const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const reviewRoutes = require('./review-routes');
const httpMocks = require('node-mocks-http');

const seeder = require('../seed/seeder');
const reviews = require('../seed/reviews');
const reviewModel = require('../models/review');

var review;
var request;

describe('Review Routes', function() {

  before(function(done) {
    seeder(reviewModel, reviews, function(reviews) {
      done();
    });
  });

  beforeEach(function() {
      request = httpMocks.createRequest({
            method: 'GET',
            url: '/reviews',
            body: {
              username: 'testuser1',
              password: 'password123'
            }
      });

      response = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
  });

  it('should get reviews', function(done) {
    response.on('end', function() {
      expect(JSON.parse(response._getData()).length).equal(3);
      done();
    });

    reviewRoutes.getReviews(request, response);
  });

  it('should get a review by id', function(done) {

    request.url = 'review';
    request.query = {
      id: 1
    };
    response.on('end', function() {
      expect(JSON.parse(response._getData()).length).equal(1);
      done();
    });

    reviewRoutes.getReview(request, response);
  });

  it('should edit a review', function(done) {
     reviewModel.findReviews(67, function (err, reviews) {
         request.url = '/review';
         request.method = 'PUT';
         request.body = {
            _id: reviews[0]._id,
            title: 'New Title'
         };

         response.on('end', function() {
             expect(JSON.parse(response._getData()).meta.title).equal('New Title');
             done();
         });

         reviewRoutes.editReview(request, response);

     });
  });

});
