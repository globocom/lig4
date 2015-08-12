'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function (req, res, next) {

  // GET user data
  res.render('editor', { user: req.session.user, title: 'Playground' });

});

module.exports = router;
