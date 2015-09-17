'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function(req, res, next) {
  var tournament = req.app.get('tournament');
  res.render('index', { tournament: tournament });
});

// GET in /:slug
router.get('/:slug', function(req, res, next) {
  var slug = req.app.get('tournament').slug;
  var _slug = req.params.slug;

  if (slug == _slug) return res.redirect('/');

  next();
});

module.exports = router;
