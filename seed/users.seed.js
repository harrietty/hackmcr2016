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
    name: 'Harriet Ryder',
    interests: 'Yoga, Knitting, Coding',
    age: 25
  },
  {
    username: 'mauro',
    name: 'Mauro Gestoso',
    interests: 'Cycling, Sci-Fi, Coding',
    age: 27
  },
  {
    username: 'drew',
    name: 'Andrews Frempong',
    interests: 'Ping Pong, Dancing, Coding',
    age: 27
  },
  {
    username: 'chris',
    name: 'Chris Heald',
    interests: 'Beer, Baking, Coding',
    age: 27
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