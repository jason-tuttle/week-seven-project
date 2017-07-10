const express = require('express');
const router = express.Router();
const Tracker = require('../models/tracker');

// GET	(/activities)	Show a list of all activities I am tracking, and links to their individual pages
router.get('/', function(req, res) {
  console.log(`User ${req.user} logged in`);
  Tracker.find({'user.username': req.user}).then(results => res.json(results));
});

// POST	(/activities)	Create a new activity for me to track.
router.post('/', function(req, res) {
  const activity = 'user.activities.'+req.body.name;
  const options = {'units': req.body.units, reps: []};
  console.log(`attempting to add activity ${activity} with units ${req.body.units}`);
  // THIS ADDS AN ACTIVITY TO A USER:
  // > db.trackers.update({'user.username':'jason'}, {$set: {'user.activities.run': {'units':'laps', 'reps':[]}}})
  Tracker.update({ 'user.username': req.user }, { $set: { activity: {options} }}, function(err, results){
    err ? res.json({'error': err}) : res.json(results);
  });
  console.log(req.body);
});

// GET	(/activities/{id})	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
router.get('/:name', function(req, res) {
  // QUERY: db.trackers.find({'user.username':'jason'}, {'user.activities.bike':1})
  const activity = 'user.activities.' + req.params.name;
  let act = Tracker.find({'user.username': req.user});
  act.select(activity);
  act.exec((err, results) => err ? res.json(err) : res.json(results));
  // Tracker.find({'user.username': req.user}).select(activity).exec(function(results) {res.json(results);});
});

// PUT	(/activities/{id})	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
router.put('/activities/:id', function(req, res) {

});

// DELETE	(/activities/{id})	Delete one activity I am tracking. This should remove tracked data for that activity as well.
router.delete('/activities/:id', function(req, res) {

  // db.trackers.update({'user.username': 'Jason'}, { $unSet: { 'user.activities': [ {name: '', units: '', rep: []}]}})
});

// POST	(/activities/{id}/stats)	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
router.post('/activities/:id/stats', function(req, res) {

  // db.trackers.update({'user.username':'jason'}, {$addToSet: {'user.activities.bike.reps': {'date':'07/10/2017', 'count':10}}})
});

// DELETE	(/stats/{id})	Remove tracked data for a day.
router.delete('/stats/:id', function(req, res) {

});

module.exports = router;
