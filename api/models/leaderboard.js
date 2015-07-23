'use strict'

var mongoose = require('mongoose')
var LeaderboardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema)
