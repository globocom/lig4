'use strict';

function GameBoard (element) {
  var container = this.container = element;
  var options = this.options = {};
  var board = this.board = {};
  var players = this.board.players = {};
  var self = this;

  // set container
  container.className += ' game-board';

  // set options
  options.rows = Number(element.getAttribute('data-rows')) || 6;
  options.columns = Number(element.getAttribute('data-columns')) || 7;
  options.interval = Number(element.getAttribute('data-interval')) * 1000 || 1000;
  options.players = Boolean(element.getAttribute('data-score')) || true;

  // set players html
  if (options.players) {
    players.element = document.createElement('div');
    players.element.className = 'game-board__players';

    players.guestElement = document.createElement('div');
    players.guestName = document.createElement('span');
    players.guestInfo = document.createElement('span');

    players.homeElement = document.createElement('div');
    players.homeName = document.createElement('span');
    players.homeInfo = document.createElement('span');

    players.guestElement.className = 'game-board__guest-player';
    players.homeElement.className = 'game-board__home-player';

    players.homeName.className = 'game-board__player-name';
    players.homeInfo.className = 'game-board__player-info';
    players.guestName.className = 'game-board__player-name';
    players.guestInfo.className = 'game-board__player-info';

    players.homeElement.appendChild(players.homeName);
    players.homeElement.appendChild(players.homeInfo);

    players.guestElement.appendChild(players.guestName);
    players.guestElement.appendChild(players.guestInfo);

    players.element.appendChild(players.homeElement);
    players.element.appendChild(players.guestElement);

    container.appendChild(players.element);
  }

  // set board html and positions
  board.size = options.rows * options.columns;
  board.element = document.createElement('ul');
  board.element.className = 'game-board__positions';
  board.positions = [];

  // generate positions
  for (var i = 0; i < board.size; i++) {
    board.positions[i] = document.createElement('li');
    board.positions[i].className = 'game-board__position';

    // insert position into board
    board.element.appendChild(board.positions[i]);
  }

  // insert board into container
  container.appendChild(board.element);

  return {
    board: self.board,
    options: self.options,
    load: self.load.bind(self),
    play: self.play.bind(self),
  };
}

GameBoard.prototype.load = function (match) {
  var positions = this.board.positions;
  var container = this.container;
  var players = this.board.players;
  var home = match.players[0];
  var guest = match.players[1];

  // set game data
  this.move = 0;
  this.moves = match.moves;
  this.sequence = match.sequence;

  // set players html
  players.homeName.innerHTML = '#' + home.position + ' ' + home.name;
  players.homeInfo.innerHTML = home.score + ' pontos';
  players.guestName.innerHTML =  guest.name + ' #' + guest.position;
  players.guestInfo.innerHTML = guest.score + ' pontos';

  // reset container
  container.className = container.className.replace('game-board--finished', '');

  // reset position
  for (var i = positions.length - 1; i >= 0; i--) {
    positions[i].className = 'game-board__position';
  }

  return this;
}

GameBoard.prototype.play = function (callback) {
  var current = this.moves[this.move];
  var player = current[0] ? 'home-play' : 'guest-play';
  var column = current[1];
  var row = current[2];
  var sequence = current[3]

  // clear timer if already exist
  if (this.timer) clearTimeout(this.timer);
  // set callback at first move
  if (callback) this.callback = callback;

  // apply current move
  this.applyPosition(player, column, row, sequence);

  // increase move
  this.move++;

  // if it's not last: play
  if (this.moves[this.move]) {
    return this.timer = setTimeout(this.play.bind(this), this.options.interval);
  }

  // show sequence
  this.container.className += ' game-board--finished';

  // execute callback
  if (this.callback) this.callback(this);
}

GameBoard.prototype.applyPosition = function (player, column, row, sequence) {
  var positions = this.board.positions;
  var position = 0;
  var length = positions.length;
  var className = 'game-board__position ' + player;

  // set sequence if it's
  if (sequence) className += ' game-board__position--sequence';

  // calculate row position
  for (var i = -1; i < row; i++) {
    position += this.options.columns;
  }

  // find column position
  position = position - (this.options.columns - column);

  // apply position
  positions[position].className = className;
}

module.exports = GameBoard;