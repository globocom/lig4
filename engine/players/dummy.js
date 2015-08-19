'use strict';

function DummyPlayer(name) {
  this.username = name || "Dummy";
}
DummyPlayer.prototype.toString = function() {
  return this.username;
};

DummyPlayer.prototype.move = function(availablePositions) {
  var index = Math.round((availablePositions.length - 1) * Math.random());

  return availablePositions[index];
};

module.exports = DummyPlayer;
