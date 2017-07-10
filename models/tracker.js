const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    user: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      activities: {
        name: { type: String, required: true},
        units: { type: String, required: true },
        reps: [{
          date: { type: Date, default: Date.now },
          count: { type: Number, default: 1 }
        }]
      }
    }
});

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;
