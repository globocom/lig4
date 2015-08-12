'use strict';

var session = require('express-session')

function setup (app) {

  var conf = app.get('config');
  var options = {
    secret: conf.session.secret,
    cookie: { secure: false },
    resave: true,
    saveUninitialized: true
  }
  if (process.env.NODE_ENV === 'prod') {
    app.set('trust proxy', 1) // trust first proxy
    options.cookie.secure = true // serve secure cookies
  }
  return session(options)
}

module.exports.setup = setup
