'use strict';

function dataAttr (element, attribute) {
  if (element.nodeType !== 1) {
    throw new Error('Invalid HTML element');
  }

  return element.getAttribute('data-' + attribute);
}

function GameBoard (element) {
  this.container = element;
  this.options = {};
  this.board = {};

  this.options.rows = parseInt(dataAttr(element, 'rows')) || 6;
  this.options.columns = parseInt(dataAttr(element, 'columns')) || 7;
  this.options.interval = parseInt(dataAttr(element, 'interval')) || 1;

  this.createBoard();
  this.renderBoard();
}

GameBoard.prototype.createBoard = function () {
  var positions = this.options.rows * this.options.columns;
  var board = this.board;

  board.element = document.createElement('ul');
  board.element.className = 'game-board__positions';

  board.positions = [];

  for (var i = 0; i < positions; i++) {
    board.positions[i] = document.createElement('li');
    board.positions[i].className = 'game-board__position';
  }

  return board;
}

GameBoard.prototype.renderBoard = function () {
  var container = this.container;
  var board = this.board;
  var positions = board.positions;
  var length = positions.length;

  for (var i = 0; i < length; i++) {
    board.element.appendChild(board.positions[i]);
  }

  container.appendChild(board.element);
}

GameBoard.prototype.applyPosition = function (player, column, row) {
  var positions = this.board.positions;
  var position = 0;
  var length = positions.length;

  for (var i = -1; i < row; i++) {
    position += this.options.columns;
  };

  position = position - (this.options.columns - column);

  positions[position].className = 'game-board__position ' + player;
}

module.exports = GameBoard;