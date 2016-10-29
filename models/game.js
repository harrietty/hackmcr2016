const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const GameSchema = new Schema({
  playerA: String,
  playerB: String,
  turn: {
    type: String,
    default: 'playerA'
  },
  turnsTaken: 0,
  orders: Array,
  score: {
    type: Number,
    default: 0
  },
  board: Array
});

module.exports = mongoose.model('Game', GameSchema);
