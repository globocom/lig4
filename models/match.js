'use strict'

var mongoose = require('../libs/mongoose');

var MatchSchema = new mongoose.Schema({
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  round: {
    type: Date,
    required: true,
    index: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

MatchSchema.statics.serialize = function (m) {
  delete m._id;
  delete m.round;
  delete m.__v;
  delete m.ack;
  delete m.result.scores;
  for (var p in m.players) {
    m.players[p] = { username: m.players[p].username };
  }
  return m
}

module.exports = mongoose.model('Match', MatchSchema);
