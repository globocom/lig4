'use strict';

function DummyPlayer(name) {
  this.name = name || "Dummy";
}
DummyPlayer.prototype.toString = function() {
  return this.name;
};

DummyPlayer.prototype.move = function(availablePositions) {
  var index = Math.round((availablePositions.length - 1) * Math.random());

  return availablePositions[index];
};

module.exports = DummyPlayer;