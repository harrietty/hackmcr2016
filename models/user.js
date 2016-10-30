const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    isRequired: true
  },
  gameId: String,
  interested: Boolean,
  message: String,
  name: String,
  age: String,
  from: String,
  friends: Array
});

module.exports = mongoose.model('User', UserSchema);
