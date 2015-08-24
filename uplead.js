'use strict';

process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json')
  .apps[0].env.DBAAS_MONGODB_ENDPOINT;

var mongoose = require('mongoose')

var Leaderboard = require('./models/leaderboard')
var Match = require('./models/match')
var Player = require('./models/player')


function upLead(uname, wins, score, draw, lost, gf, ga) {
  console.log('up lead');
  Leaderboard
    .findOneAndUpdate({
        player: uname
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
        console.log('Salvo: ', uname)
      });
};


function start(callback) {


  Match
  .find({})
  .exec({}, function (err, matches) {

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
        upLead(username, wins, score, draw, lost, playerScore.gamesFor, playerScore.gamesAgainst);
        // upLead(uname, wins, score, draw, lost, gf, ga);
      }
    }
    console.log(matches.length)

    //
  });

  //callback();

}

function main(done) {
  console.log('Uplead started!')
  mongoose.connect(process.env.DBAAS_MONGODB_ENDPOINT, function (err) {

    start(function () {
      if (done) done()
      else mongoose.disconnect() //cant send disconnect as callback
      console.log('Uplead finished!');
      process.exit();
    })

  })
};

if (!module.parent) main()

module.exports = main
