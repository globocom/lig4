'use strict'

// defaults
process.env.NODE_ENV = 'test';
process.env.PORT = 6666;
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-lig4-api';
process.env.SESSION_SECRET = 'dummy';
process.env.GITHUB_ID = 'dummy';
process.env.GITHUB_SECRET = 'dummy';

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
