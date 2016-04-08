'use strict'

var env = require('./env.js').setEnv(); // loads ENV vars

var supertest = require('supertest');
var mongoose = require('../libs/mongoose');
var assert = require('assert');
var nock = require('nock');

var Tournament = require('../models/tournament')

var app, request;

describe('API routes testing', function () {
  var player = {
    username: 'api_username_1',
    github: 'https://dummy.uri/api_username_1',
    email: 'dummy@dummies.net',
    code: 'var Player = function (){ this.move = function () { return 0; }};'
  };


  before(function (done) {

    // add a fake Tournament
    Tournament({
      name: 'test_lig4_championship_1999',
      active: true,
      isOpen: true,
      slug: 'conf_1999',
      texts: { title :  'Conference 1999'}
    }).save(function (e, t) {



        // mock github service
        nock('https://github.com')
          .post('/login/oauth/access_token')
          .reply(200, { 'access_token': '123ABC' });

        nock('https://api.github.com')
          .get('/user')
          .reply(200, {
            login: player.username,
            email: player.email
          });

        // starts api server
        app = require('../app');
        request = supertest.agent(app);

        // creates a session
        request
          .get('/auth/callback')
          .expect(302, done);

        });
  });

  it('should return ok after inserting a new player.', function (done) {
    request
      .put('/api/player/' + player.username)
      .send(player)
      .expect(200, done);
  });

  it('should return BAD_REQUEST when user code contains console or alert.', function (done) {

    var p = JSON.parse(JSON.stringify(player)); // js clone
    p.code = 'var c = console; c.log(1); alert(2)';

    request
      .put('/api/player/' + player.username)
      .send(p)
      .expect(400, done);
  });

  it('should return BAD_REQUEST when user code takes a long time to compile.', function (done) {

    var p = JSON.parse(JSON.stringify(player)); // js clone
    p.code = 'while (true) {}';

    request
      .put('/api/player/' + player.username)
      .send(p)
      .expect(400, done);
  });


  it('should return the player inserted', function (done) {
    request
      .get('/api/player/' + player.username)
      .expect(200)
      .expect(function (res) {
        var _player = res.body.payload;

        delete _player.__v;
        delete _player._id;
        delete _player.rank;

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
