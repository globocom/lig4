'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function (req, res, next) {
  if (req.session.user.rank) req.session.user.rank = false;

  // GET user data
  res.render('playground', { user: req.session.user });
});

module.exports = router;
