'use strict'

if (!process.env.DBAAS_MONGODB_ENDPOINT) {
  process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json').apps[0].env.DBAAS_MONGODB_ENDPOINT;
}

// imports
var mongoose = require('mongoose')

// models
var Player = require('./models/player')
var Match = require('./models/match')
var AsyncPool = require('./libs/process')

/**
 * Access Match collection and starts a GameEngine for each match.
 * @param {function} callback Optional function to be called at end.
 */
function startRound (callback) {

  Match
    .find()
    .where('games')
    .equals([])
    .populate('players')
    .exec(function (err, matches) {

      if (err) process.exit(err);
      if (matches.length === 0) return callback();

      var pool = new AsyncPool();

      pool.on('finish', function () {
        callback();
      });
      pool.on('message', function (m) {
        console.log("child sent ", m);
      });
      for (var match of matches) {
        pool.add('./sandbox.js', match);
      }
    });
}

/**
 * Runs lig4-game runner
 * @param {function} done Optional function to be called at end.
 */
function runner(done) {
  console.log('Runner started!')
  mongoose.connect(process.env.MONGODB_URI, function (err) {
    startRound(function () {
      if (done) done()
      else mongoose.disconnect() // cant send disconnect as callback
    })
  })
};

// runnnig
if (!module.parent) runner()

// export main fnc
module.exports = runner
