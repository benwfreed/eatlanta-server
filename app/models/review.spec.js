const expect = require('chai').expect;

const reviewModel = require('./review');
const mongoose = require('mongoose');
const seeder = require('../seed/seeder');
const reviews = require('../seed/reviews');

const uri = process.env.MONGO_TESTING_URI || 'mongodb://mongodb/eatlanta-test';

mongoose.Promise = require('bluebird');

mongoose.connect(uri, {
	useMongoClient: true
});

before(function(done) {
  seeder(reviewModel, reviews, function(res) {
    done();
  });
});

describe('Review Model', function() {

  it('should get all reviews', function(done) {
    reviewModel.findReviews(null, function(err, reviews) {
      expect(reviews.length).equal(3);
      done();
    });
  });

  it('should get a review by id', function(done) {
    reviewModel.findReviews(1, function(err, reviews) {
      expect(reviews.length).equal(1);
      done();
    });
  });

  it('should create a review', function(done) {
    reviewModel.addReview({id: 33, meta: {title: 'New Review'}}, function(err, review) {
      expect(review.id).equal(33);
      expect(review.meta.title).equal('New Review');
        done();
    });
  });

  it('should edit a review', function(done) {
    reviewModel.findReviews(33, function(err, review) {
      if (err) { return; }
      const editedReview = {
          _id: review[0]._id,
          title: 'New Title for New Review'
      };
      reviewModel.editReview(editedReview, function(err, mongoRes) {
        expect(mongoRes.meta.title).equal('New Title for New Review');
        done();
      });

    });
  });

});
