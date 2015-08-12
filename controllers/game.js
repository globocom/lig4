'use strict';

var express = require('express');
var router = express.Router();

// import models and libs
var Match = require('./../models/match');
var Response = require('./../libs/response');

// GET in /api/game
router.get('/', function (req, res, next) {
  Match
    .findOne()
    .where('ack')
    .equals(false)
    .sort('_id')
    .populate('players')
    .exec(function (err, match) {

      if (err) return Response.send(500, 'ERRO', err, res, next);
      if (!match) return res.send(204);

      Response.send(200, 'OK', match, res, next)
    });
});

module.exports = router;
