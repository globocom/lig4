'use strict';

var express = require('express');
var github = require('./../libs/github');

var router = express.Router();

// GET in /callback
router.get('/callback', function (req, res, next) {
  var config = req.app.get('config');
  var ghclient = new github.Github(
    process.env.GITHUB_ID || config.github.client_id,
    process.env.GITHUB_SECRET || config.github.client_secret
  );

  ghclient.token(req.query.code, req.session, function (token) {
    ghclient.get('/user', token, function (user) {
      req.session.user = user;
      res.redirect('/editor');
    });
  });
});

// GET in /login
router.get('/login', function (req, res, next) {
  var config = req.app.get('config');
  var client_id = process.env.GITHUB_ID || config.github.client_id;
  var authorize = github.Endpoints.AUTHORIZE_BASE_URL + client_id;
  res.redirect(authorize)
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
