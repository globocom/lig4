var mongoose = require('mongoose')
var PlayerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    indexed: true
  },
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
  }
})

module.exports = mongoose.model('Player', PlayerSchema)
