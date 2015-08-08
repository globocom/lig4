'use strict'

var mongoose = require('../libs/mongoose');
var Game = require('./game');

var MatchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  games: [Game.schema],
  //result: [MatchResultSchema],
  round: {
    type: Date,
    required: true,
    index: true
  },
  ack: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Match', MatchSchema);
