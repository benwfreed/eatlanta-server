module.exports = function(reviewModel, reviews, callback) {
  reviewModel.remove({})
  	.then( res => {
  		if (res.result) {
  			console.log('%d reviews removed from the db', res.result.n);
  		} else {
  			console.log('there was an error removing articles from the db', res);
  		}
  	})
  	.catch( err => {
  		console.log('there was an error removing articles from the db', err);
  	})
  	.then( () => {
  		reviewModel.insertMany(reviews)
  			.then( docs => {
  				console.log('%d reviews seeded into the db', docs.length);
  				callback();
  			})
  			.catch( err => {
  				console.log('there was an error inserting articles into the db', err);
  				callback();
  			});
  	});
}
