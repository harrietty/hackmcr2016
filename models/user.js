const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    isRequired: true
  },
  gameId: String,
  interests: String,
  name: String,
  age: String,
  from: String,
  friends: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('User', UserSchema);
