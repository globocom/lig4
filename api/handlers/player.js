'use strict'

// import models
var Player = require('./../models/player')
var Response = require('./response')

// Handler for POST in /api/player
function _post(req, res, next) {

  // TODO: query github api
  // TODO: server code validation

  var player = new Player(req.params)
  player.save(function (err) {
    if (err) return Response.send(500, 'ERROR', err, res, next)
    Response.send(200, 'OK', player, res, next)
  })
}

// Handler for GET in /api/player/:username
function _get(req, res, next) {

  // TODO: query github api

  Player.findOne()
    .where('username')
    .equals(req.params.username)
    .exec(function (err, player) {
      if (err) return Response.send(500, 'ERROR', err, res, next)
      if (!player) return res.send(204)
      Response.send(200, 'OK', player, res, next)
    })
}

module.exports = {
  get: _get,
  post: _post
}
