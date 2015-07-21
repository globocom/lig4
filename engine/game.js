'use strict';

var Board = require('./board');

function Game(FirstPlayer, SecondPlayer) {
  this.board    = new Board();
  this.players  = [new FirstPlayer("Jose"), new SecondPlayer("Maria")];
  this.maxPlays = Math.pow(this.board.size, 2);

  window.board = this.board;
}

Game.prototype.run = function() {
  var winner = null;

  for (var play = 0; play < this.maxPlays; play++) {
    var player  = play % 2;
    var columns = this.board.getAvailableColumns()
    var column  = this.players[player].move(columns);

    while(columns.indexOf(column) < 0) {
      column = this.players[player].move(columns);
    }

    this.board.push(player, column);

    if (this.matchAnalyzer()) {
      // console.log(this.players[player])
      winner = this.players[player]
      break;
    }
  };
  console.log(this.players)
  // console.log(winner);
  return winner

};

Game.prototype.matchAnalyzer = function() {
  var match = false;

  for (var column = 0; column < this.board.size; column++) {
    var columns = this.board.matrix[column];

    if (match) {
      break;
    }

    for (var row = 0; row < columns.length; row++) {
      var position = columns[row];

      if (position == null) {
        continue;
      }

      // vertical
      if ( columns[row + 1] == position &&
           columns[row + 2] == position &&
           columns[row + 3] == position){
        match = true;
        break;
      }

      // horizontal
      if ( this.board.matrix[column] &&
           this.board.matrix[column + 3] &&
           this.board.matrix[column + 1][row] == position &&
           this.board.matrix[column + 2][row] == position &&
           this.board.matrix[column + 3][row] == position){

        match = true;
        break;
      }

      // diagonal dir

      if ( this.board.matrix[column] &&
           this.board.matrix[column + 3] &&
           this.board.matrix[column + 1][row + 1] == position &&
           this.board.matrix[column + 2][row + 2] == position &&
           this.board.matrix[column + 3][row + 3] == position){

          match = true;
          break;
      }

      if ( this.board.matrix[column] &&
           this.board.matrix[column + 3] &&
           this.board.matrix[column + 1][row - 1] == position &&
           this.board.matrix[column + 2][row - 2] == position &&
           this.board.matrix[column + 3][row - 3] == position){

          match = true;
          break;
      }


    };
  };

  return match;
};


module.exports = Game;
