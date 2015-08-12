'use strict'

var mongoose = require('../libs/mongoose');

var GameSchema = new mongoose.Schema({
  board: {
    type: Array
  },
  moves: {
    type: Array
  }
});

module.exports = mongoose.model('Game', GameSchema);
