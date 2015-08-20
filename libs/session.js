'use strict';

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

function setup(app) {
  var store = new MongoDBStore({
    uri: process.env.DBAAS_MONGODB_ENDPOINT,
    collection: 'lig4sessions'
  });

  var options = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: true,
    saveUninitialized: true,
    store: store,
    proxy: true,
    name: 'lig4game'
  }

  return session(options)
}

function validate() {
  return function (req, res, next) {

    if (req.url.indexOf('/api/game') > -1) {
      return next();
    }

    if (req.session.access_token === undefined) {

      if (req.url.indexOf('/api') > -1) {
        return res.sendStatus(401);
      } else if (req.url.indexOf('/playground') > -1) {
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
