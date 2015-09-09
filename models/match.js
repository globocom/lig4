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

MatchSchema.statics.random = function (callback) {
  this.count(function (err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne()
      .where('result')
      .ne(null)
      .skip(rand)
      .populate('players')
      .exec(callback);
  }.bind(this));
};

MatchSchema.statics.serialize = function (m) {

  delete m._id;
  delete m.round;
  delete m.__v;
  delete m.ack;
  delete m.result.scores;

  for (var p in m.players) {
    m.players[p] = {
      username: m.players[p].username
    };
  }

  return m;
}

module.exports = mongoose.model('Match', MatchSchema);
