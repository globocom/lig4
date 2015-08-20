'use strict'

if (!process.env.DBAAS_MONGODB_ENDPOINT) {
  process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json')
    .apps[0].env.DBAAS_MONGODB_ENDPOINT;
}

// imports
var mongoose = require('mongoose')

// models
var Match = require('./models/match')
var Player = require('./models/player')

/**
 * Load all players from DB.
 * @param {function} Function to be called at end.
 */
function loadPlayers(callback) {
  var all = []
  Player
    .find()
    .where('code')
    .ne(null)
    .exec(function (err, players) {
      if (err) process.exit(err)
      players.forEach(function (player) {
        all.push(player);
      })
      console.log('Total of ' + all.length + ' players loaded.')
      callback(all);
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
 * Runs lig4-game scheduler
 * @param {function} done Optional function to be called at end.
 */
function scheduler(done) {
  console.log('Scheduler started!')
  mongoose.connect(process.env.MONGODB_URI, function (err) {
    Match.collection.remove(function () {
      newRound(function () {
        console.log('See you in 10 minutes. zzz ZZZ zzz...')
        if (done) done()
        else mongoose.disconnect() // cant send disconnect as callback
      })
    })
  });
}

// runnnig
if (!module.parent) scheduler()

// export main fnc
module.exports = scheduler
