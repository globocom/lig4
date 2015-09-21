'use strict';

function GameBoard(element) {
  var container = this.container = element;
  var options = this.options = {}
  var board = this.board = {};
  var players = this.board.players = {};
  var self = this;

  // set container
  container.className += ' game-board';

  // set options
  options.rows = 6;
  options.columns = 7;
  options.interval = 1000;

  // set players html
  players.element = document.createElement('div');
  players.element.className = 'game-board__players';

  players.guestElement = document.createElement('div');
  players.guestName = document.createElement('span');

  players.homeElement = document.createElement('div');
  players.homeName = document.createElement('span');

  players.guestElement.className = 'game-board__guest-player';
  players.homeElement.className = 'game-board__home-player';

  players.homeName.className = 'game-board__player-name';
  players.guestName.className = 'game-board__player-name';

  players.homeElement.appendChild(players.homeName);

  players.guestElement.appendChild(players.guestName);

  players.element.appendChild(players.homeElement);
  players.element.appendChild(players.guestElement);

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

  // insert elements into container
  container.appendChild(players.element);
  container.appendChild(board.element);

  return {
    board: self.board,
    options: self.options,
    load: self.load.bind(self),
    play: self.play.bind(self),
  };
}

GameBoard.prototype.load = function (gameResult) {
  var positions = this.board.positions;
  var container = this.container;
  var players = this.board.players;
  var options = this.options;

  this.result = gameResult;
  this.homePlayer = gameResult.players[0];
  this.guestPlayer = gameResult.players[1];

  // set game data
  this.move = 0;
  this.moves = gameResult.moves;
  this.sequence = gameResult.sequence;

  // set players html
  players.homeName.innerHTML = this.homePlayer.username;
  players.guestName.innerHTML = this.guestPlayer.username;

  // reset container
  container.className = container.className.replace('game-board--finished', '');

  // reset position
  for (var i = positions.length - 1; i >= 0; i--) {
    positions[i].className = 'game-board__position';
  }

  return this;
}

GameBoard.prototype.play = function (onFinish, onMove) {
  var currentMove = this.moves[this.move];
  var player = currentMove.username === this.homePlayer.username ? 'home-play' : 'guest-play';
  var column = currentMove.move[0];
  var row = currentMove.move[1];

  // clear timer if already exist
  if (this.timer) clearTimeout(this.timer);
  // set onMove at first move
  if (onMove) this.onMove = onMove;
  // set onFinish at first move
  if (onFinish) this.onFinish = onFinish;

  // apply current move
  this.applyPosition(player, column, row);

  // increase move
  this.move++;

  // execute onMove
  if (this.onMove) this.onMove(currentMove);

  // if it's not last: play
  if (this.moves[this.move])
    return this.timer = setTimeout(this.play.bind(this), this.options.interval);

  // after last move ...
  this.highlightSequence(this.sequence || []);

  // show sequence
  this.container.className += ' game-board--finished';

  // execute onFinish
  if (this.onFinish) this.onFinish(this.result);
}


GameBoard.prototype.highlightSequence = function (sequence) {
  var positions = this.board.positions;

  // foreach x and y, search for this item and apply a new css class.
  for (var index in sequence) {
    var position = 0;
    var item = sequence[index];

    // calculate row position
    for (var i = -1; i < item[1]; i++) {
      position += this.options.columns;
    }

    // find column position
    position = position - (this.options.columns - item[0]);

    // apply class
    positions[position].className += ' game-board__position--sequence';
  }
}

GameBoard.prototype.applyPosition = function (player, column, row) {
  var positions = this.board.positions;
  var position = 0;
  var length = positions.length;
  var className = 'game-board__position ' + player;

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
