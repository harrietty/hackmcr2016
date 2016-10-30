const mongoose = require('mongoose');
const async = require('async');

const User = require('../models/user');
const DB = process.env.DB || require('../config').DB;

mongoose.connect(DB, () => {
  console.log('Database connection open.', DB);
});

const users = [
  {
    username: 'harriet',
    name: 'Harriet Ryder'
  },
  {
    username: 'mauro',
    name: 'Mauro Gestoso'
  },
  {
    username: 'drew',
    name: 'Andrews Frempong'
  },
  {
    username: 'chris',
    name: 'Chris Heald'
  }
];

async.eachSeries(users, (userData, eachCallback) => {
  const userDoc = new User(userData);
  userDoc.save()
    .then(() => {
      eachCallback(null);
    })
    .catch(err => {
      eachCallback(err);
    });
}, err => {
  if (err) throw err;
  mongoose.disconnect();
});