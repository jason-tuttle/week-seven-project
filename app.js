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
mongoose.set('debug', true);
  // grab a handle for our model
const Tracker = require('./models/tracker');
  // gonna need to fetch form data from request body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
  // set up mustache template engine
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// We include this middleware for any route we want to hide behind user authentication.
const authMiddleware = passport.authenticate('basic', {session: false});

passport.use(new BasicStrategy(function(username, password, done) {
  Tracker.findOne({'user.username': username}, {'user.username': 1, 'user.password': 1}, function(err, record) {
    if (err) {
      console.log(err);
    } else {
      let loggedInUser = '';
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

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tracker';
// connect to db
mongoose.connect(uri);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', authMiddleware, function(req, res) {
  res.redirect('/activities');
});

app.post('/register', function(req, res) {
  let newActivity = {};
  newActivity[`user.activity.${req.body.activity}`] = {units: `${req.body.units}`, reps: []};
  Tracker.create({user: {
    username: req.body.username,
    password:req.body.password
    }
  })
  .then(function(result) {
    result.update({activities: newActivity}).then();
    res.json({'status': 'success', 'data':result});
  })
  .catch(err => res.json({'status': 'failed', 'data': err}));
});

app.use('/activities', authMiddleware, trackerRouter);

// LOGOUT
app.get('/logout', function(req, res) {
  req.user = null;
  res.status(401);
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() { console.log('Broadcasting on 3000FM...');});
