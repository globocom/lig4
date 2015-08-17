'use strict';

var Board = require('./board');

function Game() {
  this.board = new Board();
  this.players = [];
}

Game.prototype.addPlayer = function (player) {
  this.players.push(player)
}

Game.prototype.run = function () {
  var winner = null;

  // FIXME: force player chars or when instantiating?
  this.players[0].char = 'x'
  this.players[1].char = 'o'

  for (var play = 0; play < this.board.maxMoves; play++) {
    var currentPlayer = this.players[play % 2];
    var columns = this.board.getAvailableColumns();
    var column = currentPlayer.move(columns);

    while (columns.indexOf(column) < 0) {
      column = currentPlayer.move(columns);
    }

    this.board.push(currentPlayer, column);

    if (this.matchAnalyzer()) {
      winner = currentPlayer
      break;
    }
  };

  return winner;
};

Game.prototype.matchAnalyzer = function () {
  var match = false;

  for (var column = 0; column < this.board.width; column++) {
    var columns = this.board.matrix[column];

    if (match) {
      break;
    }

    for (var row = 0; row < this.board.height; row++) {
      var position = columns[row];

      if (position == null) {
        continue;
      }

      // vertical
      if (columns[row + 1] == position &&
        columns[row + 2] == position &&
        columns[row + 3] == position) {
        match = true;
        break;
      }

      // horizontal
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row] == position &&
        this.board.matrix[column + 2][row] == position &&
        this.board.matrix[column + 3][row] == position) {

        match = true;
        break;
      }

      // diagonal right
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row + 1] == position &&
        this.board.matrix[column + 2][row + 2] == position &&
        this.board.matrix[column + 3][row + 3] == position) {

        match = true;
        break;
      }
      // diagonal left
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row - 1] == position &&
        this.board.matrix[column + 2][row - 2] == position &&
        this.board.matrix[column + 3][row - 3] == position) {

        match = true;
        break;
      }


    };
  };

  return match;
};


module.exports = Game;
