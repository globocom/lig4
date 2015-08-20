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
  ack: {
    type: Boolean,
    default: false
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

MatchSchema.statics.serialize = function (m) {
  return m
}
module.exports = mongoose.model('Match', MatchSchema);
