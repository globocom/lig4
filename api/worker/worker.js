'use strict'

// imports
var mongoose = require('mongoose')

// models
var Config = require('./../config/dev.json')
var Match = require('./../models/match')
var Player = require('./../models/player')
var Leaderboard = require('./../models/leaderboard')

// For dev only!
var FakeEngine = function () {
  return {
    fight: function (a, b) {
      return b
    }
  }
}

var loadPlayers = function (callback) {
  var all = []
  Player.find(function (err, players) {

    if (err) process.exit(err)

    players.forEach(function (player) {
      all.push(player)
    })
    callback(all)
  })
}

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

var createMatches = function (players, callback) {
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

var currentRound = function () {
  // http://stackoverflow.com/questions/10789384
  var coeff = 1000 * 60 * 10
  var date = new Date()
  var rounded = new Date(Math.floor(date.getTime() / coeff) * coeff)
  return rounded
}

var saveMatches = function (matches, callback) {
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

    callback()
  })
}

var startBattle = function () {
  // para cada partida criada, chama o game e da um update nos results da colection match.
  // varre os registros para atualizar o leaderboard
  console.log('Iiiiiiiiiiiiiiiit\'s time!')
  var engine = new FakeEngine()

  Match
    .find()
    .where('round')
    .equals(currentRound())
    .populates('players')
    .exec(function (err, match) {

      if (err) process.exit(err)
      engine.fight(match.players, function (result) {
        console.log(result)

      })
    })
}

var newRound = function (callback) {
  loadPlayers(function (all) {
    createMatches(all, function (matches) {
      saveMatches(matches, function () {
        console.log('Matches OK!')
        callback()
      })
    })
  })
}

var main = function () {
  mongoose.connect(Config.database.uri, function (err) {

    if (err) process.exit(err)

    newRound(function () {
      startBattle(function () {
        console.log('See you in 10 minutes. zzz ZZZ zzz')
      })
    })
  })
}

main()
