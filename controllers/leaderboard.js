'use strict';

var express = require('express');
var router = express.Router();

// import models and libs
var Leaderboard = require('./../models/leaderboard');
var Response = require('./../libs/response');

// GET in /api/leaderboard
router.get('/', function (req, res, next) {
  Leaderboard
    .find()
    .sort({
      score: -1,
      win: -1,
      gamesFor: -1,
      gamesAgainst: 1
    })
    .populate('player')
    .exec(function (err, data) {

      if (err) return Response.send(500, 'ERRO', err, res, next);
      if (data.length == 0) return res.sendStatus(204);

      Response.send(200, 'OK', data, res, next);
    });
});

module.exports = router;
