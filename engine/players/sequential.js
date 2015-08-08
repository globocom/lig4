'use strict';

function SequentialPlayer(name) {
  this.name = name || "Sequential";
}
SequentialPlayer.prototype.toString = function() {
  return this.name;
};

SequentialPlayer.prototype.move = function(availablePositions) {
  var closestIndex = Math.min.apply(Math, availablePositions);
  return availablePositions[closestIndex];
};

module.exports = SequentialPlayer;
