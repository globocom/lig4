function Board() {
  this.size = 6;
  this.matrix = this.buildMatrix();
}

Board.prototype.push = function(player, column) {
  var row = this.matrix[column].lastIndexOf(null);

  if (row < 0)
    return false;

  this.matrix[column][row] = player;

  return [column, row];
};

Board.prototype.buildMatrix = function() {
  var matrix = [];

  for (var i = 0; i < this.size; i++) {
    matrix[i] = []

    for (var j = 0; j < this.size; j++) {
      matrix[i][j] = null;
    }
  }

  return matrix
};

Board.prototype.getAvailableColumns = function() {
  var positions = [];

  for(var column in this.matrix) {
    if (this.matrix[column].lastIndexOf(null) >=0 )
      positions.push(parseInt(column));
  }

  return positions;
}

module.exports = Board;