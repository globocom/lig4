'use strict'

/* globals describe, before, after, it */

// defaults
process.env.NODE_ENV = 'test'

// imports
var restify = require('restify')
var mongoose = require('mongoose')
var assert = require('assert')
var api = require('./../api')

// init the test client
var client = restify.createJsonClient({
  url: 'http://127.0.0.1:9999',
  version: '*'
})

describe('API routes testing', function () {

  before(function () {

    // Starts server
    api.listen()

    // Cleans collections
    mongoose.connection.db.dropDatabase()

  })

  it('should return ok after inserting a new player.', function (done) {

    var player = {
      username: 'api_username_1',
      github: 'https://dummy.uri/api_username_1',
      email: 'dummy@dummies.net',
      registration: 1234,
      code: 'console.log()'
    }

    client.post('/api/player', player, function (err, req, res, data) {
      if (err) throw err;
      assert.equal(200, res.statusCode)
    })

    client.get('/api/player/' + player.username, function (err, req, res, data) {
      if (err) throw err;
      var response = JSON.parse(res.body)
        .payload
      delete response.__v
      delete response._id
      assert.equal(200, res.statusCode)
      assert.equal(JSON.stringify(player), JSON.stringify(response))
    })

    done()
  })

  it('should return 204 when a player does not exists.', function (done) {

    client.get('/api/player/dummy', function (err, req, res, data) {
      assert.equal(204, res.statusCode)
      done()
    })
  })

  it('should return BAD_REQUEST when username is different from url.', function (done) {

    var player = {
      username: 'user',
      github: 'https://dummy.uri/api_username_1',
      email: 'dummy@dummies.net',
      registration: 1234,
      code: 'console.log()'
    }

    client.put('/api/player/notuser', player, function (err, req, res, data) {
      assert.equal(400, res.statusCode)
      done()
    })
  })

  after(function () {
    mongoose.connection.db.dropDatabase()
  })

})
