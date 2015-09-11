'use strict'

process.env.DBAAS_MONGODB_ENDPOINT = require('../config/dev.json')
  .apps[0].env.DBAAS_MONGODB_ENDPOINT;

var mongoose = require('mongoose');

// models
var Match = require('../models/match');
var Player = require('../models/player');
var Tournament = require('../models/tournament');

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
  callback(matches)
}

/**
 * Insert into mongodb all of pre generated matches.
 * @param {array} matches An array with pre-generated matches (in-memory).
 * @param {function} callback Function to be called at end.
 */
function saveMatches(matches, callback) {

  Tournament
    .findOne()
    .where('active')
    .equals(true)
    .exec(function (err, tournament) {

      if (err) {
        console.log(err)
        process.exit(-1);
      }

      if (!tournament) {
        console.log('At least one tournament should be active and open.')
        process.exit(-1);
      }
      console.log('Saving matches...');

      var round = Date.now();
      var bulk = []
      for (var m of matches) {
        var match = new Match()
        var p1 = Player(m[0])
        var p2 = Player(m[1])
        match.players.push(p1)
        match.players.push(p2)
        match.round = round;
        match.tournament = tournament;
        bulk.push(match)
      }

      Match.create(bulk, function (err) {
        if (err) process.exit(err)
        console.log('Total of ' + bulk.length + ' matches have been defined!')
        callback();
      });
    });
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
  console.log('Scheduler started!');
  mongoose.connect(process.env.MONGODB_URI, function (err) {
    Match.collection.remove(function () {
      newRound(function () {
        console.log('Scheduler finished.')
        if (done) done()
        else mongoose.disconnect() // cant send disconnect as callback
        process.exit();
      })
    })
  });
}

// runnnig
if (!module.parent) scheduler()
module.exports = scheduler
