'use strict'

// defaults

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

// imports
var restify = require('restify')
var mongoose = require('mongoose')

// config
var Config = require('./config/' + process.env.NODE_ENV + '.json')

// routes
var gameHandler = require('./handlers/game')
var leaderboardHandler = require('./handlers/leaderboard')
var playerHandler = require('./handlers/player')
var github = require('./libs/github')

// create server
var api = restify.createServer()

// set middlewares
api.use(restify.bodyParser())
api.use(restify.CORS())
api.use(restify.gzipResponse())
api.use(github.validateRequest())

// set handlers
api.get('/api/game', gameHandler.get)
api.get('/api/leaderboard', leaderboardHandler.get)
api.get('/api/player/:username', playerHandler.get)
api.put('/api/player/:username', playerHandler.put)
api.post('/api/player', playerHandler.post)

// get up
var listen = function (port, done) {
  // connect to mongodb
  mongoose.connect(Config.database.uri, function () {
    api.listen(process.env.API_PORT || Config.server.port, done)
    console.log('API at %s', api.url)
  })
}

// dev mode
if (!module.parent) {
  listen(Config.server.port)
}

// export listen fnc
module.exports.listen = listen
