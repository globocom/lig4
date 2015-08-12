'use strict'

var express = require('express');
var router = express.Router();

// import models and libs
var Player = require('./../models/player')
var Response = require('./../libs/response')

// POST in /api/player
router.post('/', function (req, res, next) {
  var player = new Player(req.body)

  player.save(function (err) {
    if (err) return Response.send(500, 'ERROR', err, res, next)

    Response.send(200, 'OK', player, res, next)
  })
});

// GET in /api/player/:username
router.get('/:username', function (req, res, next) {

  if (req.params.username !== req.session.user.login) return Response.send(400, 'BAD_REQUEST', {}, res, next)

  Player.findOne()
    .where('username')
    .equals(req.params.username)
    .exec(function (err, player) {
      if (err) return Response.send(500, 'ERROR', err, res, next);
      if (!player) return res.sendStatus(204);

      return Response.send(200, 'OK', player, res, next);
    });
});

// PUT in /api/player/:username
router.put('/:username', function (req, res, next) {

  if (req.body.username !== req.params.username || req.body.username !== req.session.user.login) {
    return Response.send(400, 'BAD_REQUEST', req.body, res, next);
  }

  Player
    .findOne()
    .where('username')
    .equals(req.session.user.login)
    .exec(function (err, player) {
      if (!player) return res.sendStatus(204);
      if (err) return Response.send(500, 'ERROR', err, res, next);

      // Users cannot change their username, github or e-mail.
      if (player.github === req.body.github &&
          player.username === req.body.username &&
          player.email === req.body.email) {

        player.registration = req.body.registration;
        player.code = req.body.code;

        player.save(function (err) {
          if (err) return Response.send(500, 'ERROR', err, res, next);

          return Response.send(200, 'OK', player, res, next);
        });
      } else {
        return Response.send(400, 'BAD_REQUEST', {}, res, next)
      }
    });
});

module.exports = router;
