'use strict';

// imports
var GameBoard = require('./components/gameboard');
var LeaderBoard = require('./components/leaderboard');
var scrollToSection = require('./libs/scroll');
var api = require('./libs/api');

// functions
function navigationHandler(e) {
  var button = e.currentTarget;
  var sectionName = button.getAttribute('data-section');
  var sectionElement = document.getElementById(sectionName);

  scrollToSection(sectionElement, 500);
}

// main function
function main() {
  var navigationButtons = document.getElementsByClassName('navigation-button');
  var rankingGameElement = document.getElementById('ranking-game');

  // create boards
  var rankingGame = new GameBoard(rankingGameElement);

  // set navigations listeners
  for (var i = navigationButtons.length - 1; i >= 0; i--) {
    navigationButtons[i].addEventListener('click', navigationHandler);
  }

  // start ranking board
  (function rankingRunner() {
    api('/game')
      .get(function (matchResult, status) {
        if (!matchResult || status != 200) {
          setTimeout(rankingRunner, 2500);
          return rankingGameElement.parentElement.removeChild(rankingGameElement);
        }

        var randomGame = matchResult.result.games[Math.round(Math.random())];
        randomGame.players = matchResult.players;

        rankingGame.load(randomGame)
          .play(function () {
            setTimeout(rankingRunner, 2500);
          });
      });
  })();

  (function leaderboard() {
    api('/leaderboard')
      .get(function (lbData, status) {
        if (status != 200) return setTimeout(leaderboard, 3000);

        LeaderBoard(lbData);

        setTimeout(leaderboard, 3000);
      });
  })();
}

document.addEventListener('DOMContentLoaded', main);
