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
    required: true,
    index: true
  },
  code: {
    type: String,
  },
});

PlayerSchema.statics.serialize = function (p) {
  delete p._id;
  delete p.__v;
  delete p.code;
  return p
}


module.exports = mongoose.model('Player', PlayerSchema);
