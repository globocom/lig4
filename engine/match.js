'use strict';

var Game = require('./game');

function Match() {
  this.ran = false;
  this.games = [];
  this.players = [];
  this.scores = {}
}

Match.prototype.addPlayer = function (player) {
  this.players.push(player)
  this.scores[player.username] = {
    gamesFor: 0,
    gamesAgainst: 0,
    status: null
  }
}

Match.prototype.run = function () {
  this.players[0].char = this.players[0].username;
  this.players[1].char = this.players[1].username;

  var game, result, homePlayer, awayPlayer;

  for (var gameNum = 0; gameNum < 10; gameNum++) {
    homePlayer = this.players[gameNum % 2];
    awayPlayer = this.players[Math.abs(gameNum % 2 - 1)]

    game = new Game(homePlayer, awayPlayer);
    result = game.run();

    this.games.push(result);
  }

  this.checkResult();
  this.setWinner();
  this.ran = true;
}

Match.prototype.setWinner = function () {

  var player1 = this.players[0];
  var player2 = this.players[1];

  if (this.scores[player1.username].gamesFor > this.scores[player2.username].gamesFor) {
    this.scores[player1.username].status = 'winner';
    this.scores[player2.username].status = 'looser';
    return;
  }
  if (this.scores[player1.username].gamesFor < this.scores[player2.username].gamesFor) {
    this.scores[player2.username].status = 'winner';
    this.scores[player1.username].status = 'looser';
    return;
  }

  this.scores[player1.username].status = 'draw';
  this.scores[player2.username].status = 'draw';
  return;
}

Match.prototype.checkResult = function () {
  for (var game of this.games) {
    var player1 = this.players[0];
    var player2 = this.players[1];
    if (game.winner === null) {
      continue;
    }
    if (game.winner.username === player1.username) {
      this.scores[player1.username].gamesFor += 1;
      this.scores[player2.username].gamesAgainst += 1;
    } else {
      this.scores[player2.username].gamesFor += 1;
      this.scores[player1.username].gamesAgainst += 1;
    }
  }
  return this.games;
}

Match.prototype.getResults = function () {
  if (this.ran === false) return {};

  return {
    games: this.games,
    scores: this.scores
  }
}

module.exports = Match;
