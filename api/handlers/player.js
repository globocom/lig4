'use strict'

// import models and libs
var Player = require('./../models/player')
var Response = require('./../libs/response')

// Handler for POST in /api/player
function _post(req, res, next) {

  // TODO: server code validation

  var player = new Player(req.params)

  player.save(function (err) {
    if (err) return Response.send(500, 'ERROR', err, res, next)
    Response.send(200, 'OK', player, res, next)
  })
}

// Handler for GET in /api/player/:username
function _get(req, res, next) {

  if (!req.params.username) Response.send(400, 'BAD_REQUEST', {}, res, next)

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

  // TODO: server code validation

  if (req.body.username !== req.params.username) {
    return Response.send(400, 'BAD_REQUEST', req.body, res, next)
  }

  Player
    .findOne()
    .where('username')
    .equals(req.params.username)
    .exec(function (err, player) {

      if (!player) return res.send(204)
      if (err) return Response.send(500, 'ERROR', err, res, next)

      // Users cannot change their username, github or e-mail.

      if (player.github === req.body.github &&
        player.username === req.body.username &&
        player.email === req.body.email) {

        player.registration = req.body.registration
        player.code = req.body.code
        player.save(function (err) {
          if (err) return Response.send(500, 'ERROR', err, res, next)
          return Response.send(200, 'OK', player, res, next)
        })

      } else {

        return Response.send(400, 'BAD_REQUEST', {}, res, next)

      }
    })
}

module.exports = {
  get: _get,
  post: _post,
  put: _put
}
