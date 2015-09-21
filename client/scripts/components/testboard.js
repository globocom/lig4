'use strict';

// imports
var Game = require('./game');
var GameBoard = require('./gameboard');

function TestBoard() {
  var containerElement = this.containerElement = document.createElement('div');
  var wrapperElement = this.wrapperElement = document.createElement('div');
  var boardElement = this.boardElement = document.createElement('div');
  var logsElement = this.logsElement = document.createElement('ul');
  var closeButton = this.closeButton = document.createElement('button');
  var self = this;
  this.gameboard = new GameBoard(boardElement);

  // set classes and content
  containerElement.className = 'test-board';
  wrapperElement.className = 'test-board__wrapper';
  boardElement.className = 'test-board__board';
  logsElement.className = 'test-board__logs';
  closeButton.className = 'test-board__close-button';
  wrapperElement.innerHTML = '<h3 class=\'subtitle subtitle--divisor\'>Testar algoritmo</h3>';
  closeButton.innerHTML = '×';

  // bind close listener
  closeButton.addEventListener('click', function (e) {
    e.preventDefault();

    document.body.removeChild(containerElement);
  });

  // insert elements
  wrapperElement.appendChild(boardElement);
  wrapperElement.appendChild(logsElement);
  containerElement.appendChild(wrapperElement);
  containerElement.appendChild(closeButton);

  return {
    open: self.open.bind(self),
  };
}

TestBoard.prototype.open = function (algorithm) {
  var gameboard = this.gameboard;
  var containerElement = this.containerElement;
  var boardElement = this.boardElement;
  var logsElement = this.logsElement;
  var result = new Game(algorithm).run();

  // reset elements
  logsElement.innerHTML = '';

  // start board
  this.gameboard.load(result).play(function onFinish (result) {
    console.log('Ganhou: ' + result.winner.username);
    console.log('Movimentos:', result.moves);
    console.log('Sequencia:', result.sequence);
  }, function onMove (move) {
    var item = document.createElement('li');

    item.innerHTML = [
      '<b>' + move.username + '</b>',
        'jogou na coluna',
      '<b>' + move.move[0] + '</b>;'
    ].join(' ');

    logsElement.appendChild(item);
  });

  document.body.appendChild(containerElement);
}

module.exports = TestBoard;
