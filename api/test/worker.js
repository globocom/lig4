'use strict'

/* globals describe, before, after, it */

// defaults
process.env.NODE_ENV = 'test'

// imports
var mongoose = require('mongoose')
var assert = require('assert')
var worker = require('./../worker')

// import models
var Player = require('./../models/player')
var Match = require('./../models/match')

var setupPlayers = function (done) {

  var players = []
  for (var i = 0; i < 10; i++) {
    players.push(
      new Player({
        username: 'worker_' + i,
        github: 'https://dummy.uri/worker_' + i,
        email: 'worker_' + i + '@dummies.net',
        registration: i,
        code: 'console.log()'
      }))
  }
  Player.create(players, function () {
    done()
  })

}

describe('Worker tests', function () {

  before(function (done) {
    mongoose.connection.db.dropDatabase()
    setupPlayers(done)

  })

  it('should create 45 matches.', function (done) {

    worker(function () {
      Match
        .count(function (err, count) {
          assert.equal(count, 45)
          done()
        })
    })
  })

  after(function () {
    mongoose.connection.db.dropDatabase()
  })

})
