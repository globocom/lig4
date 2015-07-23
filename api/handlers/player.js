'use strict'

// import models
var Player = require('./../models/player')
var Match = require('./../models/match')
var Leaderboard = require('./../models/leaderboard')

var setupPlayer = function (data, onEnd) {

  var player = new Player(data)
  player.save(function (err) {

    // Insert into leaderboard
    var leaderboard = new Leaderboard()
    leaderboard.player = player
    leaderboard.score = 0
    leaderboard.save()

    // Create matches
    Player
      .find()
      .where('username')
      .ne(player.username) // each other
      .exec(function (err, players) {

        players.forEach(function (opponent) {
          var match = new Match()
          match.home = player
          match.guest = opponent
          match.save(function (err) {
            // OK!
          })
        })
        onEnd(player)
      })
  })
}

// Handler for POST in /api/player
module.exports = function playerHandler(req, res, next) {

  // TODO: query github api
  // TODO: server code validation

  Player
    .findOne()
    .where('username')
    .equals(req.params.username)
    .exec(function (err, player) {

      if (err) {
        res.json(500, {
          status: 'ERROR',
          err: err
        })
      } else if (player) {
        res.json(400, {
          status: 'ERROR',
          err: 'PLAYER_ALREADY_EXISTS'
        })
      } else {
        setupPlayer(req.params, function (newPlayer) {
          res.json(200, {
            status: 'OK',
            player: newPlayer
          })
        })
      }

      return next()
    })
}
