'use strict';

function SequentialPlayer(name) {
  this.username = name || "Sequential";
}
SequentialPlayer.prototype.toString = function() {
  return this.username;
};

SequentialPlayer.prototype.move = function(availablePositions, board) {
  var closestIndex = Math.min.apply(Math, availablePositions);
  return availablePositions[closestIndex];
};

module.exports = SequentialPlayer;
