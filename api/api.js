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
api.use(restify.bodyParser({
  mapParams: true
}))
api.use(restify.CORS())
api.use(restify.gzipResponse())

// set handlers
api.get('/api/game', gameHandler.get)
api.get('/api/leaderboard', leaderboardHandler.get)
api.get('/api/player/:username', playerHandler.get)
api.put('/api/player/:username', playerHandler.put)
api.post('/api/player', playerHandler.post)

// config
nconf.file({
  file: path.join(__dirname, 'config', process.env.NODE_ENV + '.json')
})

// connect to mongodb
mongoose.connect(nconf.get('database:uri'))

// get up
var listen = function (port, done) {
  api.listen(process.env.API_PORT || nconf.get('server:port'), done)
  console.log('API at %s', api.url)
}

// dev mode
if (!module.parent) {
  listen(nconf.get('server:port'))
}

// export listen fnc
module.exports.listen = listen
