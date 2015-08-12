'use strict';

var request = require('request');
var express = require('express');

var router = express.Router();

// GET in /callback
router.get('/callback', function (req, res, next) {

  var config = req.app.get('config');
  var data = {
    'json': {
      'client_id': config.github.client_id,
      'client_secret': config.github.client_secret,
      'code': req.query.code
    }
  }

  request.post(config.github.access_token_url, data,
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        req.session.auth = body;
        res.redirect('/editor');
      }
      // Needs an error handler here...
    }
  );
});

// GET in /login
router.get('/login', function (req, res, next) {
  var config = req.app.get('config');
  var authorize = config.github.authorize_url + '?client_id=' + config.github.client_id
  res.redirect(authorize)
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
