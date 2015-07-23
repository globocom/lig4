'use strict'

/* globals describe, before, after, it */

// defaults
process.env.NODE_ENV = 'test'

// imports
var restify = require('restify')
var mongoose = require('mongoose')
var assert = require('assert')
var api = require('./../api')

// import models
var Player = require('./../models/player')
var Match = require('./../models/match')
var Leaderboard = require('./../models/leaderboard')
var Game = require('./../models/game')

// init the test client
var client = restify.createJsonClient({
  url: 'http://127.0.0.1:9999',
  version: '*'
})

describe('API routes testing', function () {

  before(function () {

    // Cleans collections
    Game.remove()
    Match.remove()
    Player.remove()
    Leaderboard.remove()

    // Starts server
    api.listen()

  })

  it('should return ok after inserting a new player.', function (done) {

    var player = {
      username: 'username_1',
      github: 'https://dummy.uri/',
      email: 'dummy@dummies.net',
      registration: 1234,
      code: 'console.log()'
    }

    client.post('/api/player', player, function (err, req, res, data) {
      assert.equal(200, res.statusCode)
      done()
    })
  })

  after(function () {
    mongoose.connection.db.dropDatabase()
  })

})
