'use strict';

var express = require('express');
var router = express.Router();

// import models and libs
var Leaderboard = require('./../models/leaderboard');
var Response = require('./../libs/response');

// GET in /api/leaderboard
router.get('/', function (req, res, next) {
  Response.send(200, 'OK', 'Tournament is over', res, next);
  // Leaderboard
  //   .find()
  //   .sort({
  //     score: -1,
  //     win: -1,
  //     gamesFor: -1,
  //     gamesAgainst: 1
  //   })
  //   .lean()
  //   .exec(function (err, leaderboards) {
  //
  //     if (err) return Response.send(500, 'ERRO', err, res, next);
  //     if (leaderboards.length == 0) return res.sendStatus(204);
  //
  //     for (var leaderboard of leaderboards) {
  //       delete leaderboard._id;
  //       delete leaderboard.__v;
  //     }
  //
  //     Response.send(200, 'OK', leaderboards, res, next);
  //   });
});

module.exports = router;
