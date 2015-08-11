'use strict'

/* globals describe, before, after, it */

// defaults
process.env.NODE_ENV = 'test'

// imports
var mongoose = require('mongoose')
var assert = require('assert')
var scheduler = require('./../scheduler')

// import models
var Player = require('./../models/player')
var Match = require('./../models/match')

var setupPlayers = function (done) {

  var players = []
  for (var i = 0; i < 10; i++) {
    players.push(
      new Player({
        username: 'scheduler_' + i,
        github: 'https://dummy.uri/scheduler_' + i,
        email: 'scheduler_' + i + '@dummies.net',
        registration: i,
        code: 'console.log()'
      }))
  }
  Player.create(players, function () {
    done()
  })

}

describe('Scheduler tests', function () {

  before(function (done) {
    mongoose.connection.db.dropDatabase()
    setupPlayers(done)

  })

  it('should create 45 matches.', function (done) {

    scheduler(function () {
      Match
        .count(function (err, count) {
          if (err) throw err
          assert.equal(count, 45)
          done()
        })
    })
  })

  after(function () {
    mongoose.connection.db.dropDatabase()
  })

})
