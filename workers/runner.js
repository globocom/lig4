'use strict'

process.env.DBAAS_MONGODB_ENDPOINT = require('../config/dev.json')
  .apps[0].env.DBAAS_MONGODB_ENDPOINT;

var mongoose = require('mongoose');
var asyncWait = require('../libs/await');

// models
var Player = require('../models/player');
var Leaderboard = require('../models/leaderboard');
var Match = require('../models/match');
var AsyncPool = require('../libs/asyncpool');

var updateResuts = {
  done: 0,
  total: 0
};

function updateResult(resultMatch) {

  var objectId = mongoose.Schema.Types.ObjectId(resultMatch.id);
  Match.update({'_id': objectId }, {'result': resultMatch }, {}, function (err) {
    console.log('Match ' + resultMatch.id + ' updated.');
    updateResuts.done++;
  });
}


function startRound(callback) {

  Match
    .find()
    .where('result')
    .equals(null)
    .populate('players')
    .exec(function (err, matches) {

      updateResuts.total = matches.length;

      if (err) process.exit(err);
      if (matches.length === 0) return callback();

      var pool = new AsyncPool(100000);

      pool.on('finish', function () {
        asyncWait.waitForUpdates(updateResuts, callback);
      });

      pool.on('message', function (resultMatch) {
        updateResult(resultMatch);
      });

      for (var match of matches) {
        pool.add('workers/sandbox.js', match);
      }
    });
}


function runner(done) {
  console.log('Runner started!')
  mongoose.connect(process.env.MONGODB_URI, function (err) {
    startRound(function () {
      if (done) done()
      else mongoose.disconnect() // cant send disconnect as callback
      console.log('Runner finished!');
      process.exit();
    })
  })
};

// runnnig
if (!module.parent) runner()
module.exports = runner
