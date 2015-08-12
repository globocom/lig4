'use strict';

// imports
var GameBoard = require('./components/gameboard');
var scrollToSection = require('./libs/scroll');

// dummy matches
var matchesLog = [{
    players: [{
      name: 'evandroeisinger',
      position: 1,
      score: 120,
    }, {
      name: 'jonathanprates',
      position: 2,
      score: 110,
    }],
    moves: [
      [0, 0, 5, 0], [1, 1, 5, 0], [0, 2, 5, 0], [1, 3, 5, 0], [0, 4, 5, 0], [1, 5, 5, 0], [0, 6, 5, 0],
      [0, 0, 4, 0], [1, 1, 4, 1], [1, 2, 4, 1], [1, 3, 4, 1], [1, 4, 4, 1],
    ]
  }, {
    players: [{
      name: 'jonathanprates',
      position: 2,
      score: 110,
    }, {
      name: 'lucastephanou',
      position: 3,
      score: 100,
    }],
    moves: [
      [0, 2, 5, 0], [1, 1, 5, 1], [0, 0, 5, 0], [1, 3, 5, 0], [0, 6, 5, 0], [1, 5, 5, 0], [0, 4, 5, 0],
      [1, 0, 4, 0], [0, 1, 4, 0], [1, 2, 4, 1], [1, 3, 4, 0], [0, 4, 4, 0], [1, 5, 4, 0], [0, 6, 4, 0],
      [0, 0, 3, 0], [1, 1, 3, 0], [1, 2, 3, 0], [1, 3, 3, 1], [0, 4, 3, 0], [1, 5, 3, 0], [0, 6, 3, 0],
      [0, 0, 2, 0], [1, 1, 2, 0], [0, 2, 2, 0], [0, 3, 2, 0], [1, 4, 2, 1],
    ]
  }];

// functions
function navigationHandler (e) {
  var button  = e.currentTarget;
  var sectionName = button.getAttribute('data-section');
  var sectionElement = document.getElementById(sectionName);

  scrollToSection(sectionElement, 500);
}

// main function
function main () {
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
    rankingGame.load(matchesLog[Math.round(Math.random())]).play(function () {
      setTimeout(rankingRunner, 2500);
    });
  }) ();
};

document.addEventListener('DOMContentLoaded', main);