'use strict';

var Game = require('./game');
var Player = require('./dummy');

function initialize() {
  window.game = new Game(Player, Player);
  console.log(window.game.run());
}

document.addEventListener('DOMContentLoaded', initialize);
