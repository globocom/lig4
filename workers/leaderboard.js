'use strict';

var mongoose = require('mongoose');
var asyncWait = require('../libs/await');

var Leaderboard = require('../models/leaderboard');
var Match = require('../models/match');
var Player = require('../models/player');

var updateResuts = {
  done: 0,
  total: 0
};

function updateLeaderboard(username, wins, score, draw, lost, gf, ga) {
  Leaderboard
    .findOneAndUpdate({
        player: username
      }, {
        $inc: {
          'win': wins,
          'score': score,
          'draw': draw,
          'lost': lost,
          'games': 1,
          'gamesFor': gf,
          'gamesAgainst': ga
        }
      }, {
        upsert: true
      },
      function (err, leaderboard) {
        if (err) return console.error(err);
        console.log('Ranking updated for user: ', username);
        updateResuts.done++;
      });
};


function start(callback) {

  Match
    .find()
    .where('result')
    .ne(null)
    .exec(function (err, matches) {

      updateResuts.total = matches.length * 2; // two players per match.

      if (err) process.exit();
      for (var match of matches) {
        for (var username in match.result.scores) {
          var playerScore = match.result.scores[username];
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
          updateLeaderboard(username, wins, score, draw, lost, playerScore.gamesFor, playerScore.gamesAgainst);
        }
      }
      asyncWait.waitForUpdates(updateResuts, callback);
    });
}

function main(done) {
  console.log('Leaderboard update started!')
  mongoose.connect(process.env.MONGOLAB_URI, function (err) {
    Leaderboard.collection.remove(function () {
      start(function () {
        if (done) done()
        else mongoose.disconnect() //cant send disconnect as callback
        console.log('Leaderboard update finished!');
        process.exit();
      });
    });
  })
};

if (!module.parent) main()

module.exports = main
