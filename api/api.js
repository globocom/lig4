'use strict'

// defaults
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

// imports
var restify = require('restify')
var mongoose = require('mongoose')
var nconf = require('nconf')
var path = require('path')

// routes
var gameHandler = require('./handlers/game')
var leaderboardHandler = require('./handlers/leaderboard')
var playerHandler = require('./handlers/player')

// create server
var api = restify.createServer()

// set middlewares
api.use(restify.bodyParser())
api.use(restify.CORS())
api.use(restify.gzipResponse())

// set handlers
api.get('/api/game', gameHandler)
api.get('/api/leaderboard', leaderboardHandler)
api.post('/api/player', playerHandler)

// config
nconf.file({
  file: path.join(__dirname, 'config', process.env.NODE_ENV + '.json')
})

// connect to mongodb
mongoose.connect(nconf.get('database:uri'))

// get up
var listen = function (port, done) {
  api.listen(process.env.API_PORT || port, done)
}

// dev mode
if (!module.parent) {
  listen(nconf.get('server:port'), function () {
    console.log('API at %s', api.url)
  })
}

// export listen fnc
module.exports.listen = listen
