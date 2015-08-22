'use strict';

process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json').apps[0].env.DBAAS_MONGODB_ENDPOINT;

// imports
var mongoose = require('mongoose')

// models
var Leaderboard = require('./models/leaderboard')
var Match = require('./models/match')


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
      });
};


function start(callback) {
  console.log('start')
  
  Match
  .find({_id: '55d8d9350fc21ec82ab0125c'},function (err, cursor) {
    console.log("------", err, cursor);  
    
      // if (err) process.exit();
      
      // cursor.each (function (error, match){
  //       console.log('Match:', match._id);
  //
  //       for (var idx in match.players) {
  //         var player = match.players[idx];
  //         var playerScore = match.result.scores[player.username];
  //
  //         var draw = 0;
  //         var score = 0;
  //         var wins = 0;
  //         var lost = 0;
  //
  //         if (playerScore.status === 'draw') {
  //           draw = 1;
  //           score = 1;
  //         } else if (playerScore.status === 'winner') {
  //           wins = 1;
  //           score = 3;
  //         } else {
  //           lost = 1;
  //         }
  //         console.log(uname, wins, score, draw, lost, gf, ga);
  //         // upLead(uname, wins, score, draw, lost, gf, ga);
  //       }
  //
  //     });
      
      callback();
    })
}

/**
 * Runs lig4-game runner
 * @param {function} done Optional function to be called at end.
 */
function main(done) {
  console.log('Uplead started!')
  mongoose.connect(process.env.DBAAS_MONGODB_ENDPOINT, function (err) {

      start(function () {
        if (done) done()
        else mongoose.disconnect() // cant send disconnect as callback
        console.log('Uplead finished!');
        process.exit();
      })

  })
};

// runnnig
if (!module.parent) main()

// export main fnc
module.exports = main
