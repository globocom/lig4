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

// Handler for PUT in /api/player/:username
function _put(req, res, next) {

  // TODO: query github api

  var data = JSON.parse(req.body)

  Player.update({ username: data.username }, data, function (err, affected) {
    if (err) return Response.send(500, 'ERROR', err, res, next)
    if (affected === 0) return res.send(204)
    Response.send(200, 'OK', {}, res, next)
  })
}

module.exports = {
  get: _get,
  post: _post,
  put: _put
}
