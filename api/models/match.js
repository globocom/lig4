'use strict'

var mongoose = require('mongoose')
var MatchSchema = new mongoose.Schema({
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
})

module.exports = mongoose.model('Match', MatchSchema)
