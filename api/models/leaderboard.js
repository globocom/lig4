'use strict'

var mongoose = require('mongoose')
var LeaderboardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  win: {
    type: Number,
    required: true,
    default: 0
  },
  draw: {
    type: Number,
    required: true,
    default: 0
  },
  lost: {
    type: Number,
    required: true,
    default: 0
  },
  gamesFor: {
    type: Number,
    required: true,
    default: 0
  },
  gamesAgainst: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema)
