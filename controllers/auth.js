'use strict';

var express = require('express');
var github = require('./../libs/github');
var Response = require('./../libs/response')
var Player = require('./../models/player');

var router = express.Router();

// GET in /callback
router.get('/callback', function (req, res, next) {
  var ghclient = new github.Github(
    process.env.GITHUB_ID,
    process.env.GITHUB_SECRET
  );

  ghclient.token(req.query.code, req.session, function (err, token) {
    if (err) return Response.send(500, 'ERROR', err, res, next)

    ghclient.get('/user', token, function (err, user) {
      if (err) return Response.send(500, 'ERROR', err, res, next);

      req.session.user = user;

      Player
        .findOne()
        .where('username')
        .equals(user.login)
        .exec(function (err, player) {
          if (player) return res.redirect('/playground');

          new Player({
            username: user.login,
            github: user.html_url,
            email: user.email,
            registration: '',
            code: ' ',
          }).save(function (err) {
            if (err) return res.redirect('/');

            res.redirect('/playground');
          });
        });
    });
  });
});

// GET in /login
router.get('/login', function (req, res, next) {
  var client_id = process.env.GITHUB_ID;
  var authorize = github.Endpoints.AUTHORIZE_BASE_URL + client_id;
  res.redirect(authorize)
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
