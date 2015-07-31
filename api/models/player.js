'use strict'

var mongoose = require('mongoose')

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
  registration: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Player', PlayerSchema)
