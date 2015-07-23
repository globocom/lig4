'use strict'

var mongoose = require('mongoose')
var GameSchema = new mongoose.Schema({
  winner: {
    type: String,
    required: true
  },
  board: {
    type: Array
  },
  moves: {
    type: Array
  }
})

module.exports = mongoose.model('Game', GameSchema)
