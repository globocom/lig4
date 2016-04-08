function Board() {
  this.width = 7;
  this.height = 6;
  this.maxMoves = this.width * this.height;
  this.matrix = this.buildMatrix();
}

Board.prototype.push = function (player, column) {
  var row = this.matrix[column].lastIndexOf(null);

  if (row < 0) return false;

  this.matrix[column][row] = player.char;

  return [column, row];
};

Board.prototype.cloneBoard = function () {

  var clone = [];
  for (var column in this.matrix) {
    clone.push(this.matrix[column].slice(0))
  }
  return clone;
};

Board.prototype.buildMatrix = function () {
  var matrix = [];

  for (var i = 0; i < this.width; i++) { // columns
    matrix[i] = []
    for (var j = 0; j < this.height; j++) { // rows
      matrix[i][j] = null;
    }
  }

  return matrix
};

Board.prototype.getAvailableColumns = function () {
  var positions = [];

  for (var column in this.matrix) {
    if (this.matrix[column].lastIndexOf(null) !== -1) positions.push(parseInt(column));
  }

  return positions;
}

Board.prototype.draw = function () {
  for (var row = 0; row < this.height; row++) {
    for (var column = 0; column < this.width; column++) {
      var cell = this.matrix[column][row] || ' ';
      process.stdout.write("| " + cell + " ");
    }
    process.stdout.write("\n");
  }
};

module.exports = Board;
