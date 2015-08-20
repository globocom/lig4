'use strict';

var Board = require('./board');

function Game(player1, player2) {
  this.board = new Board();
  this.players = [player1, player2];
}

Game.status = {
  INVALID_MOVE: 'INVALID_MOVE',
  LIG4: 'LIG4',
  DRAW: 'DRAW'
};

Game.prototype.run = function () {
  var result = {
    winner: null,
    reason: null,
    moves: [],
    sequence: []
  };

  for (var play = 0; play < this.board.maxMoves; play++) {
    var currentPlayer = this.players[play % 2];
    var columns = this.board.getAvailableColumns();
    var currentBoard = this.board.cloneBoard();
    var column = currentPlayer.move(columns, currentBoard);

    if (columns.indexOf(column) < 0) {
      result.winner = this.players[(play + 1) % 2];
      result.reason = Game.status.INVALID_MOVE;
      result.invalidMove = column;
      break;
    };

    var move = this.board.push(currentPlayer, column);
    result.moves.push({
      username: currentPlayer.username,
      move: move
    });

    var matchSequence = this.matchAnalyzer();
    if (matchSequence) {
      result.winner = currentPlayer;
      result.reason = Game.status.LIG4;
      result.sequence = matchSequence;
      break;
    }
  };

  if (!result.winner) result.reason = Game.status.DRAW;

  return result;
};

Game.prototype.matchAnalyzer = function () {
  var match = null;

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
        match = [[column, row], [column, row + 1],
                 [column, row + 2], [column, row + 3]]
        break;
      }

      // horizontal
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row] == position &&
        this.board.matrix[column + 2][row] == position &&
        this.board.matrix[column + 3][row] == position) {
        match = [[column, row], [column + 1, row],
                 [column + 2, row], [column + 3, row]]
        break;
      }

      // diagonal right
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row + 1] == position &&
        this.board.matrix[column + 2][row + 2] == position &&
        this.board.matrix[column + 3][row + 3] == position) {
        match = [[column, row], [column + 1, row + 1],
                 [column + 2, row + 2], [column + 3, row + 3]]
        break;
      }
      // diagonal left
      if (this.board.matrix[column] &&
        this.board.matrix[column + 3] &&
        this.board.matrix[column + 1][row - 1] == position &&
        this.board.matrix[column + 2][row - 2] == position &&
        this.board.matrix[column + 3][row - 3] == position) {
        match = [[column, row], [column + 1, row - 1],
                 [column + 2, row - 2], [column + 3, row - 3]]
        break;
      }


    };
  };

  return match;
};


module.exports = Game;
