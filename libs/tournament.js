'use strict';

var Tournament = require('./../models/tournament');

<<<<<<< HEAD
function init() {
  return function (req, res, next) {

=======
function initialize () {
  return function (req, res, next) {
>>>>>>> 5a0b86afff801327c150d2f566e89862038787e2
    if (req.app.get('tournament')) return next();

    Tournament
      .findOne()
      .where('active')
      .equals(true)
      .exec(function (err, tournament) {
        if (err) return res.sendStatus(500);
<<<<<<< HEAD
        if (!tournament) {
            console.log('At least one tournament should be configured.');
            return res.sendStatus(404);
        };
        if (!tournament.isOpen) {
            console.log('Tournament is over');
            return res.sendStatus(403);
        };
        req.app.set('tournament', tournament);
=======
        if (!tournament) return res.sendStatus(404);
        if (!tournament.isOpen) return res.sendStatus(403);

        req.app.set('tournament', tournament);

>>>>>>> 5a0b86afff801327c150d2f566e89862038787e2
        next();
      });
  }
}

module.exports.init = init;
