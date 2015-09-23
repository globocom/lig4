'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function (req, res, next) {
  var tournament = req.app.get('tournament');
  res.render('index', { tournament: tournament });
});

router.get('/favicon.ico', function (req, res, next) {
  return res.sendStatus(200);
});

router.get('/:tournament', function (req, res, next) {
  return res.redirect(301, '/');
});

module.exports = router;
