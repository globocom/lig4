'use strict';

var express = require('express');
var router = express.Router();

// GET in /
router.get('/', function (req, res, next) {

  // GET user data
  res.render('editor', {
    session: req.session.auth.access_token
  });

});

module.exports = router;
