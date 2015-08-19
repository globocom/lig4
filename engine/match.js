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
  this.players[0].gamesFor = 0;
  this.players[1].gamesFor = 0;
  this.players[0].gamesAgainst = 0;
  this.players[1].gamesAgainst = 0;

  var game, result, homePlayer, awayPlayer;

  for (var gameNum = 0; gameNum < 10; gameNum++) {
    homePlayer = this.players[gameNum % 2];
    awayPlayer = this.players[Math.abs(gameNum % 2 - 1)]

    game = new Game(homePlayer, awayPlayer);
    result = game.run();

    this.games.push(result);
  }

  this.checkResult();
  this.ran = true;
}

Match.prototype.getWinner = function() {

    if (this.players[0].gamesFor > this.players[1].gamesFor) {
        return this.players[0];
    }
    if (this.players[0].gamesFor < this.players[1].gamesFor){
        return this.players[1];
    }
    return null;
}

Match.prototype.checkResult = function () {
  for (var game of this.games) {
    var player1 = this.players[0];
    var player2 = this.players[1];
    if (game.winner === undefined) {
      continue;
    }
    if (game.winner.username === player1.username) {
      player1.gamesFor += 1;
      player2.gamesAgainst += 1;
    } else {
      player2.gamesFor += 1;
      player1.gamesAgainst += 1;
    }
  }
  return this.games;
}

Match.prototype.getResults = function () {
  if (this.ran === false) return {};

  return {
    games: this.games,
    winner: this.getWinner()
  }
}

module.exports = Match;
