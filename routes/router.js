'use strict';
const express = require('express');
const router = express.Router();
const Tracker = require('../models/tracker');

/* *****************************************************************************
** GET	(/activities)
** Show a list of all activities I am tracking, and links to their individual
** pages -- THIS WORKS
***************************************************************************** */
router.get('/', function(req, res) {
  console.log(`User ${req.user} logged in`);
  const allActs = Tracker.findOne({'user.username': req.user});
    allActs.select('user.activities');
    allActs.exec(function(err, results) {
      // const data = results.user.activities;
      err ? res.json({'error': error}) : res.json(results.user.activities);
    });
});

/* *****************************************************************************
** POST	(/activities)
** Create a new activity for me to track.
** THIS IS FIXED
***************************************************************************** */
router.post('/', function(req, res) {
  const userQuery = { 'user.username': req.user };
  const activity = 'user.activities.'+req.body.name;
  const options = {'units': req.body.units, 'reps': []};
  const newActivity = {};
  newActivity[activity] = options;
  console.log(`attempting to add activity ${activity} with units ${req.body.units}`);
  const query = Tracker.findOne(userQuery);
  query.select(activity);
  query.exec(function(err, result) {
    if (err) {
      res.json({'status': 'failed', 'error': err})
    } else {
      console.log(result.user);
      if (result.user.activites) {
        res.json({'status': 'failed', 'error': 'That activity already exists'});
      } else {
        Tracker.collection.update({_id: result._id},{$set: newActivity}, {new: true, upsert: true}, function(err, newItem) {
          res.json({'status': 'success', 'message': newItem});
        });
      }
    }
  });
      // Tracker.update({ 'user.username': req.user }, { $set: { activity: {options} }}, function(err, results){
      //   err ? res.json({'error': err}) : res.json(results);
      // });
      console.log(req.body);
});

/* *****************************************************************************
** GET	(/activities/{id})
** Show information about one activity I am tracking, and give me the data I
** have recorded for that activity.
** THIS WORKS
***************************************************************************** */
router.get('/:name', function(req, res) {
  // QUERY: db.trackers.find({'user.username':'jason'}, {'user.activities.bike':1})
  const activity = 'user.activities.' + req.params.name;
  let act = Tracker.findOne({'user.username': req.user});
  act.select(activity);
  act.exec((err, results) => err ? res.json(err) : res.json(results.user.activities));
  // Tracker.find({'user.username': req.user}).select(activity).exec(function(results) {res.json(results);});
});

/* *****************************************************************************
** PUT	(/activities/{id})
** Update one activity I am tracking, changing attributes such as name or type.
** Does not allow for changing tracked data.
***************************************************************************** */
router.put('/:name', function(req, res) {
  res.json({'data': 'put request incomplete'});
});

/* *****************************************************************************
** DELETE	(/activities/{id})
** Delete one activity I am tracking. This should remove tracked data for that
** activity as well.
** IT WORKS!!!!!!!!!!
***************************************************************************** */
router.delete('/:name', function(req, res) {
  const userQuery = { 'user.username': req.user };
  const activity = 'user.activities.'+req.params.name;
  const deleteMe = {};
  deleteMe[activity] = {units:'', reps:[]};

  console.log(`attempting to remove activity ${activity}`);
  const query = Tracker.findOne(userQuery);
  query.select(activity);
  query.exec(function(err, result) {
    if (err) {
      res.json({'status': 'failed', 'error': err})
    } else {
      console.log(result.user);
      if (result.user.activites) {
        res.json({'status': 'failed', 'error': 'That activity already exists'});
      } else {
        Tracker.collection.update({_id: result._id},{$unset: deleteMe}, {new: true}, function(err, newItem) {
          if (err) {
            res.json({'status': 'failed', 'error': err})
          } else {
            res.json({'status': 'success', 'message': newItem});
          }

        });
      }
    }
  });
  // db.trackers.update({'user.username': 'Jason'}, { $unSet: { 'user.activities': [ {name: '', units: '', rep: []}]}})
});

/* *****************************************************************************
** POST	(/activities/{id}/stats)
** Add tracked data for a day. The data sent with this should include the day
** tracked. You can also override the data for a day already recorded.
** THIS IS BROKE
***************************************************************************** */
router.post('/stats/:name', function(req, res) {
  // db.trackers.update({'user.username':'jason'}, {$addToSet: {'user.activities.bike.reps': {'date':'07/10/2017', 'count':10}}})
  let activity = 'user.activities.'+req.params.name+'.reps';
  let newRep = {};
  newRep['date'] = req.body.date;
  newRep['count'] = req.body.count;
  const newActivity = {};
  newActivity[activity] = newRep;

  Tracker.findOneAndUpdate({
    query: {'user.username': req.user},
    update: {$addToSet: newActivity},
    new: true,
    fields: {activity}
  })
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.json({'error': err});
  });
});

/* *****************************************************************************
*  DELETE	(/stats/{id})
*  Remove tracked data for a day.
***************************************************************************** */
router.delete('/stats/:id', function(req, res) {
  // db.trackers.findOneAndUpdate({'user.username':'jason'}, {$pull: {'user.activities.bike.reps': {$in:['07/11/2017']}}})
  res.json({'data': 'delete request incomplete'});
});
module.exports = router;
