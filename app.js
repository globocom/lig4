'use strict';

// imports
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('./libs/session');

// controllers
var indexController = require('./controllers/index');
var authController = require('./controllers/auth');

var gameController = require('./controllers/game');
var leaderboardController = require('./controllers/leaderboard');
var playerController = require('./controllers/player');
var editorController = require('./controllers/editor');

// create express application
var app = express();

// set view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set midlewares
app.use(session.setup(app));
app.use(session.validate());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set controllers && handlers
app.use('/', indexController);
app.use('/auth', authController);
app.use('/editor', editorController);

app.use('/api/game', gameController);
app.use('/api/player', playerController);
app.use('/api/leaderboard', leaderboardController);

// run app
module.exports = app.listen(process.env.PORT, function () {
  console.log('app listening at port %s', process.env.PORT);
});
