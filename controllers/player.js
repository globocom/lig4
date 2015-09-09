'use strict'

var vm = require('vm');
var express = require('express');
var router = express.Router();

// import models and libs
var Player = require('./../models/player')
var Response = require('./../libs/response')

// GET in /api/player/:username
router.get('/:username', function (req, res, next) {

  if (req.params.username !== req.session.user.login) {
    return Response.send(400, 'BAD_REQUEST', {}, res, next)
  }

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

  if (req.params.username !== req.session.user.login) {
      return Response.send(400, 'BAD_REQUEST', req.body, res, next);
  }

  if (req.body.code &&
      req.body.code.indexOf('alert') > -1 ||
      req.body.code.indexOf('console') > -1) {
      return Response.send(400, 'INVALID_ES5_CODE', {}, res, next);
  }

  Player
    .findOne()
    .where('username')
    .equals(req.session.user.login)
    .exec(function (err, player) {

      if (!player) player = new Player(req.body); // first access
      if (err) return Response.send(500, 'ERROR', err, res, next);

      try {
        var testContext = {};
        vm.createContext(testContext);
        vm.runInContext(req.body.code, testContext, {
          timeout: 1000
        });
      } catch (e) {
        return Response.send(400, 'INVALID_ES5_CODE', e, res, next);
      }

      player.code = req.body.code;

      player.save(function (err) {
        if (err) return Response.send(500, 'ERROR', err, res, next);

        return Response.send(200, 'OK', player, res, next);
      });
    });
});

module.exports = router;
