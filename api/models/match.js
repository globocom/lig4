'use strict'

var Player = require('./../models/player')
var Games = require('./../models/game')

var mongoose = require('mongoose')

var MatchResultSchema = new mongoose.Schema({
  player1: {
    type: Number,
    required: true,
    default: 0
  },
  player2: {
    type: Number,
    required: true,
    default: 0
  }
})

var MatchSchema = new mongoose.Schema({
  players: [Player],
  games: [Games],
  result: [MatchResultSchema]
})

module.exports = mongoose.model('Result', MatchResultSchema)
module.exports = mongoose.model('Match', MatchSchema)
