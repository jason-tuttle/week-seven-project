const express = require('express');
const router = express.Router();
const Tracker = require('../models/tracker');

// GET	(/activities)	Show a list of all activities I am tracking, and links to their individual pages
router.get('/', function(req, res) {
  console.log(`User ${req.user} logged in`);
  const allActs = Tracker.findOne({'user.username': req.user});
    allActs.select('user.activities');
    allActs.exec(function(err, results) {
      // const data = results.user.activities;
      err ? res.json({'error': error}) : res.json(results.user.activities);
    });
});

// POST	(/activities)	Create a new activity for me to track.
router.post('/', function(req, res) {
  const userQuery = { 'user.username': req.user };
  const activity = 'user.activities.'+req.body.name;
  const options = {'units': req.body.units, 'reps': []};
  const newActivity = {};
  newActivity[activity] = options;
  console.log(`attempting to add activity ${activity} with units ${req.body.units}`);
  const query = Tracker.find(userQuery);
  query.select(activity);
  query.exec(function(err, results) {
    if (err) {
      res.json({'error': err})
    } else {
      if (results.user) {
        res.json({'error': 'That activity already exists!'});
      } else {
        Tracker.findOneAndUpdate(userQuery,
          newActivity,
          { new: true,
            upsert: true,
            setDefaultsOnInsert: true
          },
          function(err, result) {
            if (err) { res.json({'update error': err.message}) }
            else { res.json(result) }
          }
        );
      // Tracker.update({ 'user.username': req.user }, { $set: { activity: {options} }}, function(err, results){
      //   err ? res.json({'error': err}) : res.json(results);
      // });
    }
  }
});
  // THIS ADDS AN ACTIVITY TO A USER:
  // > db.trackers.update({'user.username':'jason'}, {$set: {'user.activities.run': {'units':'laps', 'reps':[]}}})


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
