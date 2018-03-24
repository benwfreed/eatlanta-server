var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
	id: Number,
	meta: {
		id: Number,
		title: String,
		author: String,
		description: String,
		location: String,
		neighborhood: String,
		mapPreviewUrl: String,
		address: String
	},
	content: String,
	coordinates: {
		north: Number,
		south: Number,
		east: Number,
		west: Number
	}
});

// export the model itself for utility/testing

var Review = module.exports = mongoose.model('Review', reviewSchema);

// use these methods in the app to abstract
// away from the mongoose model

module.exports.findReviews = function(id, callback) {
	const query = id ? {id: id} : {};
	Review.find(query, callback);
}

module.exports.addReview = function(comment, callback) {
	Review.create(comment, callback);
};

module.exports.editReview = function(editedReview, callback) {
	const query = {_id: editedReview._id};
	const options = {upsert: false, multi: false, new: true};
	Review.findOneAndUpdate(query,
				  {$set:
						 {
                            'content': editedReview.content,
                            'meta.title': editedReview.title,
                            'meta.author' : editedReview.author,
                            'meta.description' : editedReview.description,
                            'meta.location' : editedReview.location,
                            'meta.neighborhood' : editedReview.neighborhood,
                            'meta.mapPreviewUrl': editedReview.mapPreviewUrl,
                            'meta.address': editedReview.address
						 }
					},
				  options,
				  callback);
};
