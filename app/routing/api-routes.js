var express = require('express');
var api = express.Router();
var User = require('../models/user.js');
var Review = require('../models/review.js');
var passport = require('passport');
var aws = require('aws-sdk');
var S3Bucket = process.env.S3_BUCKET;

// cors

api.use(function(req, res, next) {
	const uri = process.env.BASE_URL || 'http://localhost:3500'
	res.header('Access-Control-Allow-Origin', uri);
  res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
	res.header('Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With,' +
    'Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, withCredentials');
	next();
});

// Authentication

require('./user-routes/auth-routes')(api);

// Add, remove, get user

require('./user-routes/user-routes')(api);

// Reviews

require('./review-routes')(api);

// Images

api.get('/sign-s3-get', function(req, res) {
	var s3 = new aws.S3();
	var s3Params = {
		Bucket: S3Bucket,
		Key: fileName,
		Expires: 60
	};
	s3.getSignedUrl('getObject', s3Params, function(err, data) {
		if (err) {
			console.log(err);
			return res.end();
		}
		var returnData = {
			signedRequest: data,
			url: 'https://'+S3Bucket+'.s3.amazonaws.com/'+fileName
		};
		res.json(returnData);
	});
});

module.exports = api;
