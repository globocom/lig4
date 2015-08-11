'use strict';

// defaults
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

// imports
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var config = require('./config');

// controllers
var indexController = require('./controllers/index');
var gameController = require('./controllers/game');
var leaderboardController = require('./controllers/leaderboard');
var playerController = require('./controllers/player');

// create express application
var api = express();

// set view
api.set('views', path.join(__dirname, 'views'));
api.set('view engine', 'jade');

// set midlewares
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(express.static(path.join(__dirname, 'public')));

// set controllers && handlers
api.use('/', indexController);

api.use('/api/game', gameController);
api.use('/api/player', playerController);
api.use('/api/leaderboard', leaderboardController);

// run api
module.exports = api.listen(config.server.port, function () {
  console.log('api listening at port %s', config.server.port);
});
