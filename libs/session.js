'use strict';

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

function setup (app) {
  var conf = app.get('config');
  var store = new MongoDBStore({
    uri: process.env.DBAAS_MONGODB_ENDPOINT || conf.database.uri,
    collection: 'lig4sessions'
  });

  var options = {
    secret: process.env.SESSION_SECRET || conf.session.secret,
    cookie: {},
    resave: true,
    saveUninitialized: true,
    store: store,
    proxy: true,
    name: 'lig4game'
  }

  /*
  if (process.env.NODE_ENV === 'prod') {
    app.set('trust proxy', 1);
    options.cookie.secure = true;
  }
  */

  return session(options)
}

function validate () {
  return function (req, res, next) {
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
