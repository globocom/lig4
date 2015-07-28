'use strict'

// import models
var Match = require('./../models/match')
var Response = require('./response')

// Handler for GET in /api/game
function _get(req, res, next) {

  Match
    .findOne()
    .where('ack')
    .equals(false)
    .sort('_id')
    .populate('players')
    .exec(function (err, match) {

      if (err) return Response.send(500, 'ERRO', err, res, next)
      if (!match) return res.send(204)
      Response.send(200, 'OK', match, res, next)

    })
}

module.exports = {
  get: _get
}
