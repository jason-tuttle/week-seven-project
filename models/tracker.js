const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    user: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    }
});

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;
