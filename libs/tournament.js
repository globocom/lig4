'use strict';

var Tournament = require('./../models/tournament');

function init() {
  return function (req, res, next) {

    if (req.app.get('tournament')) return next();

    Tournament
      .findOne()
      .where('active')
      .equals(true)
      .exec(function (err, tournament) {
        if (err) return res.sendStatus(500);
        if (!tournament || !tournament.isOpen) {
            console.log('At least one tournament should be configured.');
            return res.render('closed');
        };

        req.app.set('tournament', tournament);
        next();
      });
  }
}

module.exports.init = init;
