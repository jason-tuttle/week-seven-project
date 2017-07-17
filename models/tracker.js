const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    user: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      activities: [
        {
          name: String,
          unit: String,
          reps: [
            {
              date: {type: Date, default: Date.now },
              count: Number
            }
          ]
        }
      ]
    }
});

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;
