'use strict';

// imports
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('./libs/session');
var tournament = require('./libs/tournament');

// controllers
var indexController = require('./controllers/index');
var authController = require('./controllers/auth');

var gameController = require('./controllers/game');
var leaderboardController = require('./controllers/leaderboard');
var playerController = require('./controllers/player');
var playgroundController = require('./controllers/playground');

// create express application
var app = express();

// set view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session.setup(app));
app.use(session.validate());
app.use(tournament.init());

// set controllers && handlers
app.use('/auth', authController);
app.use('/playground', playgroundController);

app.use('/api/game', gameController);
app.use('/api/player', playerController);
app.use('/api/leaderboard', leaderboardController);

app.use('/', indexController);

// run app
module.exports = app.listen(process.env.PORT, function () {
  console.log('app listening at port %s', process.env.PORT);
});
