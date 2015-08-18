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
      /*
      var sequences = result.match.sequence;
      var logs = result.match.logs;
      for (var i = 0; i < logs.length; i++) {
        var boardPosition = logs[i];
        var boardCol = logs[i].move[0];
        var boardRow = logs[i].move[1];

        boardPosition.sequence = false;
        for (var j = 0; j < sequences.length; j++) {
          var sequencePosition = sequences[j];
          var sequenceCol = sequencePosition[0];
          var sequenceRow = sequencePosition[1];

          if (boardCol == sequenceCol && boardRow == sequenceRow) {
            boardPosition.sequence = true;
            break;
          };
        };
      };
      */
      
      Response.send(200, 'OK', match, res, next)
    });
});

module.exports = router;
