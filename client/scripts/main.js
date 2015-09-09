'use strict';

// imports
var Dialog = require('./components/dialog');
var GameBoard = require('./components/gameboard');
var LeaderBoard = require('./components/leaderboard');
var api = require('./libs/api');

// main function
function main() {
  var gameBoardElement = document.getElementById('game-board');
  var leaderBoardElement = document.getElementById('leader-board');
  var rulesLinkElement = document.getElementById('rules-link');
  var rewardLinkElement = document.getElementById('reward-link');

  // create boards and dialog
  var dialog = new Dialog();
  var gameboard = new GameBoard(gameBoardElement);
  var leaderboard = new LeaderBoard(leaderBoardElement);

  function openDialog (e) {
    e.preventDefault();
    dialog.show(e.currentTarget.getAttribute('data-content-id'));
  }

  rulesLinkElement.addEventListener('click', openDialog);
  rewardLinkElement.addEventListener('click', openDialog);

  // load game board
  (function loadGameboard() {
    api('/game?' + Date.now())
      .get(function (data, status) {
        if (status != 200) return setTimeout(loadGameboard, 2500);

        var game = data.result.games[0];
        game.players = data.players;

        gameboard.load(game)
          .play(function () {
            setTimeout(loadGameboard, 2500);
          });
      });
  })();

  (function loadLeaderboard() {
    api('/leaderboard?' + Date.now())
      .get(function (data, status) {
        if (status != 200) return setTimeout(loadLeaderboard, 3000);

        leaderboard.load(data);

        setTimeout(loadLeaderboard, 3000);
      });
  })();
}

document.addEventListener('DOMContentLoaded', main);
