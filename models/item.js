const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    isRequired: true
  }
});

module.exports = mongoose.model('Item', ItemSchema);
