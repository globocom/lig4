'use strict'

var mongoose = require('../libs/mongoose');

var TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    required: true
  },
  texts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
