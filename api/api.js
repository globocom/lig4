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
var app = express();

// set view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set controllers && handlers
app.use('/', indexController);

app.use('/api/game', gameController);
app.use('/api/player', playerController);
app.use('/api/leaderboard', leaderboardController);

// run app
module.exports = app.listen(config.server.port, function () {
  console.log('app listening at port %s', config.server.port);
});
