const express = require('express');
const router = express.Router();
const Tracker = require('../models/tracker');

// GET	(/activities)	Show a list of all activities I am tracking, and links to their individual pages
router.get('/activities', function(req, res) {
  Tracker.find({where: {user.username: req.user}}, results => res.json(results));
});

// POST	(/activities)	Create a new activity for me to track.
router.post('/activites', function(req, res) {
  console.log(req.body);
});

// GET	(/activities/{id})	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
router.get('/activites/:id', function(req, res) {

});

// PUT	(/activities/{id})	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
router.put('/activities/:id', function(req, res) {

});

// DELETE	(/activities/{id})	Delete one activity I am tracking. This should remove tracked data for that activity as well.
router.delete('/activities/:id', function(req, res) {

});

// POST	(/activities/{id}/stats)	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
router.post('/activities/:id/stats', function(req, res) {

});

// DELETE	(/stats/{id})	Remove tracked data for a day.
router.delete('/stats/:id', function(req, res) {

});

module.exports = router;
