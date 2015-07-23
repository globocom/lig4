var mongoose = require('mongoose')
var PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  github: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
