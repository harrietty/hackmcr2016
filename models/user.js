const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    isRequired: true
  },
  gameId: String
});

module.exports = mongoose.model('User', UserSchema);
