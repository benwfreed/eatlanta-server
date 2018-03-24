var Review = require('../models/review.js');

module.exports = function(api) {

  const reviewError = function(req, err) {
    const message = 'there was an error getting review(s) from the db';
    res.status = 500;
    res.json({
      message: message,
      error: error
    });
  }

  api.get('/reviews', getReviews);

  api.get('/review', getReview);

  api.put('/review', editReview);

}

const getReviews = function(req, res) {
  var data;
  Review.findReviews(null, function(err, reviews) {
    data = reviews;
    if (err) {
      reviewError(req, err);
    }
    res.json(data);
  });
}

const getReview = function(req, res) {
  var data;
  Review.findReviews(req.query.id, function(err, review) {
    if (err) {
      reviewError(req, err);
    }
    if (review) {
      data = review;
    } else {
      data = {
        error: 'could not find review'
      };
    }
    res.json(data);
  });
}

const editReview = function(req, res) {
  var editedReview = req.body;
  console.log(req.body);
  Review.editReview(editedReview, function(err, mongoRes) {
    res.json(mongoRes);
  });
}

// export functions for testing
module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
module.exports.editReview = editReview;
