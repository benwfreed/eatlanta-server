var reviewModel = require('../models/review');
var mongoose = require('mongoose');
var reviews = require('./reviews.json');
const uri = process.env.MONGO_URI || 'mongodb://mongodb/eatlanta';

mongoose.Promise = require('bluebird');

mongoose.connect(uri, {
	useMongoClient: true
});

const seeder = require ('./seeder.js');

seeder(reviewModel, reviews, function() {
	mongoose.disconnect();
});
