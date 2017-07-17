const Tracker = require('../models/tracker');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/tracker');

var tracker = new Tracker(
  {user: {
    username:'bob',
    password: 'password',
    activities:[
      {
        name: 'run',
        unit: 'laps',
        reps: [
          { date: '07/10/2017',
            count: 4
          },
          {
            date: '07/12/2017',
            count: 5
          }
        ]
      }
    ]
  }
});
tracker.save()
  .then((record) => console.log('created a new record: '+record))
  .catch((error) => console.log('error: '+error));

console.log('Did a thing?');

mongoose.connection.close();

// user: {
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   activities: [
//     {
//       name: String,
//       unit: String,
//       reps: [
//         {
//           date: {type: Date, default: Date.now },
//           count: Number
//         }
//       ]
//     }
//   ]
// }
