'use strict';

var express = require('express');
var router = express.Router();

// import models and libs
var Match = require('./../models/match');
var Response = require('./../libs/response');

// GET in /api/game
router.get('/', function (req, res, next) {
  Match
    .random(function (err, match) {

      if (err) return Response.send(500, 'ERRO', err, res, next);
      if (!match) return Response.send(204, 'NO_MATCH', err, res, next);

      var m = Match.serialize(match);
      Response.send(200, 'OK', m, res, next)
    });
});

module.exports = router;
