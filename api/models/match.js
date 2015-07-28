'use strict'

var Game = require('./game')
var mongoose = require('mongoose')

var MatchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  games: [Game.schema],
  //result: [MatchResultSchema],
  round: {
    type: Date,
    required: true
  },
  delivered: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Match', MatchSchema)
