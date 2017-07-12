const Tracker = require('../models/tracker');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/tracker_dev');

var tracker = new Tracker({user: {username:"bob", password: "password"}});
tracker.save()
  .then((record) => console.log('created a new record'))
  .catch((error) => console.log('error: '+error));

console.log("Did a thing?");

mongoose.connection.close();
