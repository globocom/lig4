'use strict';

var express = require('express');
var router = express.Router();
var Player = require('../models/player');

// GET in /
router.get('/', function (req, res, next) {

    Player.findOne()
        .where('username')
        .equals(req.session.user.login)
        .exec(function (err, player) {
            if (!player) return res.redirect("/auth/logout"); // Invalid user.

            req.session.user.rank = player.rank;
            // GET user data
            res.render('playground', { user: req.session.user });
        });
});

module.exports = router;
