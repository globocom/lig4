'use strict'

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

// imports
var mongoose = require('mongoose')

// models
var Config = require('./../config/' + process.env.NODE_ENV + '.json')
var Match = require('./../models/match')
var Player = require('./../models/player')
var Leaderboard = require('./../models/leaderboard')

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
 * Load all players from DB.
 * @param {function} Function to be called at end.
 */
function loadPlayers(callback) {
  var all = []
  Player.find(function (err, players) {
    if (err) process.exit(err)
    players.forEach(function (player) {
      all.push(player)
    })
    console.log('Total of ' + all.length + ' players loaded.')
    callback(all)
  })
}

/**
 * Randomly sort an array.
 * @param {array} Array to sort.
 */
function shuffleArray(array) {
  console.log('Raffling games...')
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

/**
 * Given a player list, it creates a NxN match list.
 * @param {array} List of players.
 * @param {function} Function to be called at end.
 */
function createMatches(players, callback) {
  console.log('Creating matches...')
    // total = players * (players - 1) / 2
  var matches = []
  for (var i = 0; i < players.length; i++) {
    for (var j = i + 1; j < players.length; j++) {
      var player1 = players[i]
      var player2 = players[j]
      matches.push([player1, player2])
    }
  }
  matches = shuffleArray(matches)
  callback(matches)
}

/**
 * Gets an identifier for this round.
 * @return {date} Returns a 10-minute truncated Date object.
 */
function currentRound() {
  // http://stackoverflow.com/questions/10789384
  var coeff = 1000 * 60 * 10
  var date = new Date()
  var rounded = new Date(Math.floor(date.getTime() / coeff) * coeff)
  return rounded
}

/**
 * Insert into mongodb all of pre generated matches.
 * @param {array} matches An array with pre-generated matches (in-memory).
 * @param {function} callback Function to be called at end.
 */
function saveMatches(matches, callback) {
  console.log('Saving matches...')
  var bulk = []
  for (var m of matches) {
    var match = new Match()
    var p1 = Player(m[0])
    var p2 = Player(m[1])
    match.players.push(p1)
    match.players.push(p2)
    match.round = currentRound()
    bulk.push(match)
  }

  Match.create(bulk, function (err) {
    if (err) process.exit(err)
    console.log('Total of ' + bulk.length + ' matches have been defined!')
    callback()
  })
}

/**
 * Access Match collection and starts a GameEngine for each one.
 * @param {function} callback Optional function to be called at end.
 */
function startBattle(callback) {

  console.log('Iiiiiiiiiiiiiiiit\'s time!')
  var engine = new FakeEngine()

  Match
    .find()
    .where('round')
    .equals(currentRound())
    .populate('players')
    .exec(function (err, matches) {

      if (err) process.exit(err)

      for (var match of matches) {
        var result = engine.fight(match.players)
          // para cada partida criada, chama o game e da um update nos results da colection match.
          // varre os registros para atualizar o leaderboard
      }
      callback()
    })
}

/**
 * Callback waterfall to create a new round of matches.
 * @param {function} callback Optional function to be called at end.
 */
function newRound(callback) {
  console.log('Creating new round')
  loadPlayers(function (all) {
    createMatches(all, function (matches) {
      saveMatches(matches, function () {
        callback()
      })
    })
  })
}

/**
 * Run lig4-game worker
 * @param {function} done Optional function to be called at end.
 */
function worker(done) {
  console.log('Worker started!')
  mongoose.connect(Config.database.uri, function (err) {
    newRound(function () {
      startBattle(function () {
        console.log('See you in 10 minutes. zzz ZZZ zzz...')
        if (done) done()
        else mongoose.disconnect() // cant send disconnect as callback
      })
    })
  })
}

// runnnig
if (!module.parent) worker()

// export main fnc
module.exports = worker
