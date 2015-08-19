'use strict'

if (!process.env.DBAAS_MONGODB_ENDPOINT) {
  process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json')
    .apps[0].env.DBAAS_MONGODB_ENDPOINT;
}

// imports
var mongoose = require('mongoose')

// models
var Player = require('./models/player')
var Leaderboard = require('./models/leaderboard')
var Match = require('./models/match')
var AsyncPool = require('./libs/process')

/**
 * Access Match collection and starts a GameEngine for each match.
 * @param {function} callback Optional function to be called at end.
 */
function startRound(callback) {

  Leaderboard.collection.remove();

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
      pool.on('message', function (resultMatch) {

        Match
          .findOne()
          .where('_id')
          .equals(resultMatch.id)
          .populate('players')
          .exec(function (err, match) {
            match.result = resultMatch.result
            match.save(function (err) {

              // node doesn't support destructuring assignment yet
              for (var player of match.players) {

                Leaderboard
                  .findOneAndUpdate({ upsert: true })
                  .where('player')
                  .equals(player)
                  .exec(function (err, leaderboard) {

                    console.log(match.result)
                    /*
                    // won
                    leaderboard.win += 1
                    leaderboard.score += 3
                      // loose
                    leaderboard.lost += 1
                      // tied
                    leaderboard.draw += 1
                    leaderboard.score += 1
                      // for
                    leaderboard.gamesFor = match.result.bla
                      // against
                    leaderboard.gamesAgainst = match.result.bla2
                    */
                  })
              }

              console.log(resultMatch.result)



              var leaderboard = new Leaderboard();
              leaderboard.winner = match.result.winner

            });
          });
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
