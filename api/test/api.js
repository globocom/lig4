'use strict'

/* globals describe, before, after, it */

var restify = require('restify')
var assert = require('assert')
var api = require('./../api')

// init the test client
var client = restify.createJsonClient({
  url: 'http://127.0.0.1:9999',
  version: '*'
})

describe('API routes testing', function () {

  before(function () {
    api.listen(9999)
  })

  it('should get a 200 response', function (done) {
    client.get('/api/game', function (err, req, res, data) {
      assert.equal(200, res.statusCode)
      done()
    })
  })

  after(function () {
    // ...
  })

})
