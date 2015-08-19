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
    .where('result')
    .equals(null)
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

              for (var player of match.players) {
                var playerScore = match.result.scores[player.username];

                var draw = 0;
                var score = 0;
                var wins = 0;
                var lost = 0;

                if (playerScore.status === 'draw') {
                  draw = 1;
                  score = 1;
                } else if (playerScore.status === 'winner') {
                  wins = 1;
                  score = 3;
                } else {
                  lost = 1;
                }
                Leaderboard
                  .findOneAndUpdate({
                      player: player
                    }, {
                      $inc: {
                        'win': wins,
                        'score': score,
                        'draw': draw,
                        'lost': lost,
                        'games': 1,
                        'gamesFor': playerScore.gamesFor,
                        'gamesAgainst': playerScore.gamesAgainst
                      }
                    }, {
                      upsert: true
                    },
                    function (err, leaderboard) {
                      return
                    });
              }
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
      console.log('Runner finished!');
    })
  })
};

// runnnig
if (!module.parent) runner()

// export main fnc
module.exports = runner
