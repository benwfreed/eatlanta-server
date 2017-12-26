// To modify urls, set a cookie secret,  etc.,
// add a file called .env to this directory (the
// app directory) and add varibles like this:
// MongoDB_URI=mongodb//no_quotes_required. dotenv
// will add all of these to process.env
require('dotenv').config({path: __dirname + '/.env'});

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const expressSessions = require('express-sessions');
const expressSession = require('express-session');
const morgan = require('morgan');
const User = require('./models/user.js');
const apiRoutes = require('./routing/api-routes.js');

// initialize express

const app = express();

// set up database

const uri = process.env.MONGO_URI || 'mongodb://mongodb/eatlanta';


// connect to db via mongoose

mongoose.connect(uri, {
	useMongoClient: true
});

// set up cookies and sessions

const sessionStore = new (expressSessions) ({
	storage: 'mongodb',
	instance: mongoose,
	collection: 'sessions',
	expire: 85000
});

const cookieSecret = process.env.COOKIE_SECRET || 'cookie_secret';

app.use(cookieParser(cookieSecret));

app.use(expressSession({
	secret: cookieSecret,
	store: sessionStore,
	resave: true,
	saveUninitialized: true
}));

// set up body parser

app.use(bodyParser.urlencoded({
	extended: 'true'
}));

app.use(bodyParser.json());

// set up authentication

app.use(passport.initialize());

app.use(passport.session());

passport.use(new localStrategy((username, password, done) => {
	User.getUserByUsername(username, function(err, user) {
		if (err) {return done(err)};
		if (!user) {
			return done(null, false, {message: 'No Such Username'});
		} else {
			User.comparePassword(password, user.password, function(err, isMatch) {
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {message: 'Incorrect Password'});
				}
			});
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

//set up logging

app.use(morgan('dev'));

// set up routes

app.use('/api', apiRoutes);

const listener = app.listen(process.env.PORT || 8080, function() {
	console.log('Eatlanta API running on port ' + listener.address().port);
});
