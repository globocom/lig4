/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// imports
	var Dialog = __webpack_require__(1);
	var GameBoard = __webpack_require__(2);
	var LeaderBoard = __webpack_require__(3);
	var api = __webpack_require__(4);

	// main function
	function main() {
	  var gameBoardElement = document.getElementById('game-board');
	  var leaderBoardElement = document.getElementById('leader-board');
	  var rulesLinkElement = document.getElementById('rules-link');
	  var rewardLinkElement = document.getElementById('reward-link');

	  // create boards and dialog
	  var dialog = new Dialog();
	  var gameboard = new GameBoard(gameBoardElement);
	  var leaderboard = new LeaderBoard(leaderBoardElement);

	  function openDialog (e) {
	    e.preventDefault();
	    dialog.show(e.currentTarget.getAttribute('data-content-id'));
	  }

	  rulesLinkElement.addEventListener('click', openDialog);
	  rewardLinkElement.addEventListener('click', openDialog);

	  // load game board
	  (function loadGameboard() {
	    api('/game?' + Date.now())
	      .get(function (data, status) {
	        if (status != 200) return setTimeout(loadGameboard, 2500);

	        var game = data.result.games[0];
	        game.players = data.players;

	        gameboard.load(game)
	          .play(function () {
	            setTimeout(loadGameboard, 2500);
	          });
	      });
	  })();

	  (function loadLeaderboard() {
	    api('/leaderboard?' + Date.now())
	      .get(function (data, status) {
	        if (status != 200) return setTimeout(loadLeaderboard, 3000);

	        leaderboard.load(data);

	        setTimeout(loadLeaderboard, 3000);
	      });
	  })();
	}

	document.addEventListener('DOMContentLoaded', main);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function Dialog() {
	  var container = this.container = document.createElement('div');
	  var wrapper = this.wrapper = document.createElement('div');
	  var closeButton = this.closeButton = document.createElement('button');
	  var contents = this.contents = document.getElementsByClassName('dialog__content');
	  var content = this.content = {};
	  var self = this;

	  // set classes and content
	  container.className = 'dialog';
	  wrapper.className = 'dialog__wrapper';
	  closeButton.className = 'dialog__close-button';
	  closeButton.innerHTML = '×';

	  // load dialog content
	  for (var i = contents.length - 1; i >= 0; i--) {
	    var contentElement = contents[i];

	    content[contentElement.id] = contentElement.innerHTML;
	    contentElement.parentElement.removeChild(contentElement);
	  }

	  // bind close listener
	  closeButton.addEventListener('click', function (e) {
	    e.preventDefault();

	    document.body.removeChild(container);
	  });

	  // insert elements
	  container.appendChild(wrapper);
	  container.appendChild(closeButton);

	  return {
	    show: self.show.bind(self),
	  };
	}

	Dialog.prototype.show = function (contentId) {
	  this.wrapper.innerHTML = this.content[contentId];
	  document.body.appendChild(this.container);
	}

	module.exports = Dialog;


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	  if (this.onFinish) this.onFinish(this);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function LeaderBoard(element) {
	  var container = this.container = element;
	  var tableHead = this.tableHead = document.createElement('thead');
	  var tableBody = this.tableBody = document.createElement('tbody');
	  var self = this;

	  var headRow = document.createElement('tr');
	  var headColPosition = document.createElement('td');
	  var headColWins = document.createElement('td');
	  var headColDraws = document.createElement('td');
	  var headColLosses = document.createElement('td');
	  var headColScore = document.createElement('td');

	  container.className = 'leader-board';
	  headColPosition.className = 'leader-board__position';
	  headColWins.className = 'leader-board__wins';
	  headColDraws.className = 'leader-board__draws';
	  headColLosses.className = 'leader-board__losses';
	  headColScore.className = 'leader-board__score';

	  headColPosition.innerHTML = 'Melhores jogadores';
	  headColWins.innerHTML = 'V';
	  headColDraws.innerHTML = 'E';
	  headColLosses.innerHTML = 'D';

	  headColWins.title = 'Vitórias';
	  headColDraws.title = 'Empates';
	  headColLosses.title = 'Derrotas';

	  container.innerHTML = '';

	  headRow.appendChild(headColPosition);
	  headRow.appendChild(headColWins);
	  headRow.appendChild(headColDraws);
	  headRow.appendChild(headColLosses);
	  tableHead.appendChild(headRow);

	  container.appendChild(tableHead);
	  container.appendChild(tableBody);

	  return {
	    load: self.load.bind(self),
	  }
	}

	LeaderBoard.prototype.load = function (data) {
	  var tableBody = this.tableBody;
	  var size = data.length;

	  // clean old board
	  tableBody.innerHTML = '';

	  // generate positions
	  for (var i = 0; i < size; i++) {
	    var position = data[i];
	    var row = document.createElement('tr');
	    var colPosition = document.createElement('td');
	    var colWins = document.createElement('td');
	    var colDraws = document.createElement('td');
	    var colLosses = document.createElement('td');
	    var colScore = document.createElement('td');

	    row.className = 'leader-board__player';
	    colPosition.className = 'leader-board__position';
	    colWins.className = 'leader-board__wins';
	    colDraws.className = 'leader-board__draws';
	    colLosses.className = 'leader-board__losses';

	    colPosition.innerHTML = ['<b>#' + (i + 1) + '</b>', position.player + ',', position.score, 'pt\'s'].join(' ');
	    colWins.innerHTML = position.win;
	    colDraws.innerHTML = position.draw;
	    colLosses.innerHTML = position.lost;

	    colWins.title = position.win + ' vitórias';
	    colDraws.title = position.draw + ' empates';
	    colLosses.title = position.lost + ' derrotas';

	    row.appendChild(colPosition);
	    row.appendChild(colWins);
	    row.appendChild(colDraws);
	    row.appendChild(colLosses);
	    tableBody.appendChild(row);
	  }
	}

	module.exports = LeaderBoard;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var url = '//' + document.location.host + '/api';

	function api(path) {
	  var xhr = new XMLHttpRequest();

	  return {
	    get: function(callback) {
	      xhr.open('GET', url + path);
	      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	      xhr.addEventListener('load', function() {
	        var response = null;

	        if (xhr.response) response = JSON.parse(xhr.response).payload

	        callback(response, xhr.status);
	      });
	      xhr.send();
	    },

	    put: function(data, callback) {
	      xhr.open('PUT', url + path);
	      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	      xhr.addEventListener('load', function() {
	        var response = null;

	        if (xhr.status == 401) document.location.reload();
	        if (xhr.response) response = JSON.parse(xhr.response).payload;

	        callback(response, xhr.status);
	      });
	      xhr.send(JSON.stringify(data));
	    },
	  }
	}

	module.exports = api;

/***/ }
/******/ ]);