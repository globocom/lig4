'use strict'

// defaults
process.env.NODE_ENV = 'test';

// imports
var request = require('supertest');
var mongoose = require('../libs/mongoose');
var assert = require('assert');
var api;

describe('API routes testing', function () {
  var player = {
    username: 'api_username_1',
    github: 'https://dummy.uri/api_username_1',
    email: 'dummy@dummies.net',
    registration: 1234,
    code: 'console.log();'
  };

  before(function () {
    // starts api server
    api = require('../app');

    // cleans collections
    mongoose.connection.db.dropDatabase();
  });

  it('should return ok after inserting a new player.', function (done) {
    request(api)
      .post('/api/player')
      .send(player)
      .expect(200, done);
  });

  it('should return the player inserted', function (done) {
    request(api)
      .get('/api/player/' + player.username)
      .expect(200)
      .expect(function (res) {
        var _player = res.body.payload;

        delete _player.__v;
        delete _player._id;

        assert.equal(JSON.stringify(player), JSON.stringify(_player))
      })
      .end(done);
  });

  it('should return 204 when a player does not exists.', function (done) {
    request(api).get('/api/player/dummy').expect(204, done);
  })

  it('should return BAD_REQUEST when username is different from url.', function (done) {
    request(api)
      .put('/api/player/notuser')
      .send(player)
      .expect(400, done);
  });

  after(function () {
    api.close();
    mongoose.connection.db.dropDatabase();
  });

});
