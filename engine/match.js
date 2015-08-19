'use strict';

var Game = require('./game');

function Match() {
  this.ran = false;
  this.games = [];
  this.players = [];
}

Match.prototype.addPlayer = function (player) {
  this.players.push(player)
}

Match.prototype.run = function () {
  this.players[0].char = 'x';
  this.players[1].char = 'o';
  this.players[0].wins = 0;
  this.players[1].wins = 0;

  var game, result, homePlayer, awayPlayer;

  for (var gameNum = 0; gameNum < 10; gameNum++) {
    homePlayer = this.players[gameNum % 2];
    awayPlayer = this.players[Math.abs(gameNum % 2 - 1)]

    game = new Game(homePlayer, awayPlayer);
    result = game.run();

    if (result.winner) result.winner.wins += 1;

    this.games.push(result);
  }

  this.ran = true;
}

Match.prototype.getResults = function () {
  if (this.ran === false) return {};

  return {
    games: this.games
  }
}

module.exports = Match;
