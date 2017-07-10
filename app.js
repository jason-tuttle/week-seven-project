'use strict';
const express = require('express');
const app = express();
// using a route handler for convenience
const trackerRouter = require('./routes/router');
// using passport-http for authentication
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
// using mongoose to add schema to our MondoDB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// grab a handle for our model
const Tracker = require('./models/tracker');
// gonna need to fetch form data from request body
const bodyParser = require('body-parser');

// We include this middleware for any route we want to hide behind user authentication.
const authMiddleware = passport.authenticate("basic", {session: false});

passport.use(new BasicStrategy(function(username, password, done) {
  Tracker.findOne({'user.username': username}, {'user.username': 1, 'user.password': 1}, function(err, record) {
    if (err) {
      console.log(err);
    } else {
      let loggedInUser = "";
      if (record.user.password === password) {
        loggedInUser = record.user.username;
      }
      if (loggedInUser) {
        return done(null, loggedInUser);
      } else {
        return done(null, false);
      }
    }
  });
}));

// connect to db
mongoose.connect('mongodb://localhost:27017/tracker');

app.get('/', function(req, res) {
  res.send('Welcome to StatTracker! <a href="/login">Click here</a> to log in.');
});

app.get('/login', authMiddleware, function(req, res) {
  res.redirect('/activities');
});

app.use('/activities', authMiddleware, trackerRouter);

// LOGOUT
app.get('/logout', function(req, res) {
  res.status(401);
  res.redirect('/');
});

app.listen(3000, function() { console.log("Broadcasting on 3000FM...");});
