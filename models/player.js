'use strict'

var mongoose = require('../libs/mongoose');

var PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  github: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  code: {
    type: String
  },
  draft: {
    type: String
  },
  rank: {
    type: Number,
    default: 0
  },
});

PlayerSchema.statics.serialize = function (p) {
  delete p._id;
  delete p.__v;
  delete p.code;
  delete p.draft;
  return p
}


module.exports = mongoose.model('Player', PlayerSchema);
