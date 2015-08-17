'use strict'

if (!process.env.NODE_ENV) {
  process.env.DBAAS_MONGODB_ENDPOINT = 'mongodb://localhost:27017/dev-lig4-api';
}

// imports
var mongoose = require('mongoose')

// models
var Match = require('./models/match')
var Player = require('./models/player')

// For dev only!
var FakeEngine = function () {
  return {
    fight: function (players) {
      //console.log(players[0].username + ' vs ' + players[1].username)
      return players[1]
    }
  }
}

/**
 * Access Match collection and starts a GameEngine for each one.
 * @param {function} callback Optional function to be called at end.
 */
function startBattle (callback) {

  console.log('Iiiiiiiiiiiiiiiit\'s time!')
  var engine = new FakeEngine()

  Match
    .find()
    .where('games')
    .equals([])
    .populate('players')
    .exec(function (err, matches) {

      if (err) process.exit(err)

      for (var match of matches) {
        var result = engine.fight(match.players)
        console.log(result)
          // para cada partida criada, chama o game e da um update nos results da colection match.
          // varre os registros para atualizar o leaderboard
      }
      callback()
    })
}

/**
 * Runs lig4-game runner
 * @param {function} done Optional function to be called at end.
 */
function runner(done) {
  console.log('Runner started!')
  mongoose.connect(process.env.DBAAS_MONGODB_ENDPOINT, function (err) {
    startBattle(function () {
      if (done) done()
      else mongoose.disconnect() // cant send disconnect as callback
    })
  })
}

// runnnig
if (!module.parent) runner()

// export main fnc
module.exports = runner
