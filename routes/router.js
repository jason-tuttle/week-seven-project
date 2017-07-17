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
  Tracker.findOne({'user.username': req.user},'user.activities')
    .then(results => res.status(200).json({'status':'success', 'data':results}))
    .catch(err => { res.status(500).json({'status': 'failed', 'error': err.message}); });
});

/* *****************************************************************************
** POST	(/activities)
** Create a new activity for me to track.
** POST BODY: name, units
** THIS IS FIXED
***************************************************************************** */
router.post('/', function(req, res) {
  const userQuery = { 'user.username': req.user };
  const activity = 'user.activities.'+req.body.name;
  const options = {'units': req.body.units, 'reps': []};
  const newActivity = {};
  newActivity[activity] = options;
  // console.log(`attempting to add activity ${activity} with units ${req.body.units}`);
  const query = Tracker.findOne(userQuery);
  query.select(activity);
  query.exec(function(err, result) {
    if (err) {
      res.status(500).json({'status': 'failed', 'error': err});
    } else {
      console.log(result.user);
      if (result.user.activites) {
        res.status(409).json({'status': 'failed', 'error': 'That activity already exists'});
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
  act.exec((err, results) => err ? res.status(500).json(err) : res.render('activities', {results}));
  // Tracker.find({'user.username': req.user}).select(activity).exec(function(results) {res.json(results);});
});

/* *****************************************************************************
** PUT	(/activities/{id})
** Update one activity I am tracking, changing attributes such as name or type.
** Does not allow for changing tracked data.
** SEEMS TO WORK
***************************************************************************** */
router.put('/:name', function(req, res) {
  const renameTo = {};
  if (req.body.newName) {
    renameTo[`user.activities.${req.params.name}`] = `user.activities.${req.body.newName}`;
  }
  if (req.body.newUnits) {
    renameTo[`user.activities.${req.params.name}.units`] = `user.activities.${req.body.newName}.${req.params.name}`;
  }
  Tracker.collection.findOneAndUpdate(
    {'user.username':req.user},
    {$rename: renameTo},
    {new: true}
  )
  .then(result => res.json({'status':'success', 'data':result}))
  .catch(err => res.status(500).json({'status': 'failed', 'error': err}));
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
      res.status(500).json({'status': 'failed', 'error': err.message});
    } else {
      console.log(result.user);
      if (result.user.activites) {
        res.status(409).json({'status': 'failed', 'error': 'That activity already exists'});
      } else {
        Tracker.collection.update({_id: result._id},{$unset: deleteMe}, {new: true}, function(err, newItem) {
          if (err) {
            res.status(500).json({'status': 'failed', 'error': err.message});
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
** THIS... WORKS?
***************************************************************************** */
router.post('/stats/:name', function(req, res) {
  // db.trackers.update({'user.username':'jason'}, {$addToSet: {'user.activities.bike.reps': {'date':'07/10/2017', 'count':10}}})
  let activity = 'user.activities.'+req.params.name+'.reps';
  let newRep = {};
  newRep['date'] = req.body.date;
  newRep['count'] = req.body.count;
  const newActivity = {};
  newActivity[activity] = newRep;

  Tracker.collection.findOneAndUpdate({'user.username': req.user},{$addToSet: newActivity},{'new': true})
  .then(function(result){
    res.json({'status':'success', 'data':result});
  })
  .catch(function(err){
    res.status(500).json({'error': err.message});
  });
});

/* *****************************************************************************
*  DELETE	(/activities/stats/{id})
*  Remove tracked data for a day.
** HOLY SHIT IT FUCKING WORKS!
***************************************************************************** */
router.delete('/stats/:name', function(req, res) {
  const deleteActivity = `user.activities.${req.params.name}.reps`;
  // const deleteDate = [{date: req.body.date}];
  // deleteDate['$in'] = [{date: req.body.date}];
  // deleteActivityFor[`user.activities.${req.params.name}.reps`] = deleteDate;
  // db.trackers.findOneAndUpdate({'user.username':'jason'}, {$pull: {'user.activities.bike.reps': {$in:['07/11/2017']}}})
  Tracker.collection.findOneAndUpdate(
    {'user.username': req.user},
    {$pull: {[deleteActivity]: {date: req.body.date}}},
    {new: true})
  .then(result => res.json({'status':'success','data':result}))
  .catch(err => res.status(500).json({'status':'failed','error':err.message}));
});

module.exports = router;
