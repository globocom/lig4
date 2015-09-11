'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function(req, res, next) {
  var tournament = req.app.get('tournament');
  res.render('index', { tournament: tournament });
});

module.exports = router;
