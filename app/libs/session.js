'use strict';

var session = require('express-session')

function setup (app) {

  var conf = app.get('config');
  var options = {
    secret: conf.session.secret,
    cookie: {},
    resave: true,
    saveUninitialized: true
  }
  if (process.env.NODE_ENV === 'prod') {
    app.set('trust proxy', 1);
    options.cookie.secure = true;
  }
  return session(options)
}

function validate () {

  return function (req, res, next) {

    if (process.env.NODE_ENV === 'test') return next();

    if (req.session.access_token === undefined) {
      if (req.url.indexOf('/api') > -1) {
        return res.sendStatus(401);

      } else if (req.url.indexOf('/editor') > -1) {
        return res.redirect('/auth/login');
      }
    }
    next();
  }
}

module.exports = {
  'setup': setup,
  'validate': validate
}
