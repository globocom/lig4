'use strict';

var Tournament = require('./../models/tournament');

function initialize () {
  return function (req, res, next) {
    if (req.app.get('tournament')) return next();

    Tournament
      .findOne()
      .where('active')
      .equals(true)
      .exec(function (err, tournament) {
        if (err) return res.sendStatus(500);
        if (!tournament) return res.sendStatus(404);
        if (!tournament.isOpen) return res.sendStatus(403);

        req.app.set('tournament', tournament);

        next();
      });
  }
}

module.exports.initialize = initialize;
