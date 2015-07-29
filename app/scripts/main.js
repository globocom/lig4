'use strict';

var GameBoard = require('./components/gameboard');
var scrollToSection = require('./libs/scroll');

// functions
function navigationHandler (e) {
  var button  = e.currentTarget;
  var section = document.getElementById(button.getAttribute('data-section'));

  scrollToSection(section);
}


// main function
function main () {
  var navigationButtons = document.getElementsByClassName('navigation-button');
  var rankingGameElement = document.getElementById('ranking-game');
  var rankingGame = new GameBoard(rankingGameElement);

  for (var i = navigationButtons.length - 1; i >= 0; i--) {
    navigationButtons[i].addEventListener('click', navigationHandler);
  }

  window.game = rankingGame;
};

document.addEventListener('DOMContentLoaded', main);