'use strict'

// defaults
process.env.NODE_ENV = 'test';
process.env.PORT = 6666;
process.env.DBAAS_MONGODB_ENDPOINT = 'mongodb://localhost:27017/test-lig4-api';
process.env.SESSION_SECRET = 'dummy';
process.env.GITHUB_ID = 'dummy';
process.env.GITHUB_SECRET = 'dummy';

// imports
var supertest = require('supertest');
var mongoose = require('../libs/mongoose');
var assert = require('assert');
var nock = require('nock');

var app, request;

describe('API routes testing', function () {
  var player = {
    username: 'api_username_1',
    github: 'https://dummy.uri/api_username_1',
    email: 'dummy@dummies.net',
    code: 'console.log();'
  };

  before(function (done) {
    // mock github service
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, { 'access_token': '123ABC' });

    nock('https://api.github.com')
      .get('/user')
      .reply(200, { 'login': 'api_username_1' });

    // starts api server
    app = require('../app');
    request = supertest.agent(app);

    // creates a session
    request
      .get('/auth/callback')
      .expect(302, done);

    // cleans collections
    mongoose.connection.db.dropDatabase();
  });

  it('should return ok after inserting a new player.', function (done) {
    request
      .put('/api/player/' + player.username)
      .send(player)
      .expect(200, done);
  });

  it('should return the player inserted', function (done) {
    request
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

  it('should return BAD_REQUEST when username is different from url.', function (done) {
    request
      .put('/api/player/notuser')
      .send(player)
      .expect(400, done);
  });

  after(function () {
    app.close();
    mongoose.connection.db.dropDatabase();
  });
});
