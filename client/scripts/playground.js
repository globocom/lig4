'use strict';

// imports

var api = require('./libs/api');
var Editor = require('./libs/editor');
var Algorithm = require('./libs/algorithm');
var Game = require('../../engine/game');
var GameBoard = require('./components/gameboard');

// elements and vars

var testButton;
var submitButton;
var resetButtom;
var closeTestButtom;
var playgroundEditor;
var playgroundTextarea;
var playgroundRunner;
var playgroundTemplate;
var playgroundWrapper;
var gameboard;
var testBoard;
var playgroundTestBoard;
var playgroundTestLogs;
var player;

// functions

function RandomAlgorithm () {
  this.move = function(availablePositions) {
    var index = Math.round((availablePositions.length - 1) * Math.random());

    return availablePositions[index];
  };

  this.char = 'R';
  this.username = 'aleatório';
}

function loadPlayerHandler (_player, status) {
  player = _player;

  if (!player.code) {
    return playgroundTextarea.value = playgroundTemplate;
  }

  playgroundTextarea.value = player.code;
}

function testAlgorithm (callback, showTestBoard) {
  var game = null;
  var result = null;

  try {
    player.algorithm = new Algorithm(playgroundTextarea.value);
    player.algorithm.username = player.username;
    player.algorithm.char = 'P';

    game = new Game(player.algorithm, new RandomAlgorithm);
    result = game.run();
    result.players = [{
      username: player.username
    }, {
      username: 'RandomAlgorithm'
    }];

    if (!showTestBoard) return callback(false, result);

    // show test game
    playgroundTestLogs.innerHTML = '';
    playgroundWrapper.style.overflow = 'hidden';
    playgroundEditor.appendChild(playgroundTestBoard);

    testBoard.load(result).play(function () {
      console.log('Ganhou: ' + result.winner.username);
      console.log('Movimentos:', result.moves);
      console.log('Sequencia:', result.sequence);

      callback(false, result);
    }, function (play) {
      playgroundTestLogs.innerHTML += [
        '<li>',
          '<b>', play.username, '</b> jogou na coluna <b>', play.move[0] + 1, '</b>;',
        '</li>'
      ].join('');

      console.log(play);
    });
  } catch (error) {
    callback(true, error);

    throw error;
  }
}

function testHandler (e) {
  e.preventDefault();

  testButton.innerHTML = 'Testando...'
  testButton.disabled = true;

  testAlgorithm(function (err, data) {
    if (err) {
      testButton.innerHTML = 'Testar';
      testButton.disabled = false;

      return alert(data);
    }

    // show gameboard render
    testButton.innerHTML = 'Testar';
    testButton.disabled = false;
  }, true);
}

function closeTestHandler (e) {
  e.preventDefault();

  playgroundTestLogs.innerHTML = '';
  playgroundWrapper.style.overflow = 'initial';
  playgroundEditor.removeChild(playgroundTestBoard);

  testButton.innerHTML = 'Testar';
  testButton.disabled = false;
}

function resetHandler (e) {
  e.preventDefault();

  playgroundTextarea.value = playgroundTemplate;
}

function submitHandler (e) {
  e.preventDefault();

  testButton.disabled = true;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Salvando...';

  testAlgorithm(function (err, data) {
    if (err) {
      testButton.disabled = false;
      submitButton.innerHTML = 'Salvar';
      submitButton.disabled = false;

      return alert(data);
    }

    // save player algorithm
    api('/player/' + player.username).put({
      code: playgroundTextarea.value
    }, function () {
      submitButton.innerHTML = 'Salvo c/ sucesso!';
      testButton.disabled = false;

      setTimeout(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Salvar';
      }, 2500);
    }, false);
  });
}

// main function
function playground () {
  testButton = document.getElementById('test-algorithm-button');
  closeTestButtom = document.createElement('button');
  submitButton = document.getElementById('submit-algorithm-button');
  resetButtom = document.getElementById('reset-algorithm-button');
  playgroundEditor = document.getElementById('playground-editor');
  playgroundWrapper = document.getElementById('playground');
  playgroundTextarea = document.getElementById('playground-textarea');
  playgroundRunner = document.getElementById('playground-runner');
  playgroundTestBoard = document.createElement('div');
  playgroundTestLogs = document.createElement('ul');
  gameboard = document.createElement('div');

  playgroundTestBoard.className = 'playground-test-board';
  playgroundTestLogs.className = 'playground-test-logs';
  gameboard.className = 'game-board';
  closeTestButtom.className = 'button playground__close-test-button';
  closeTestButtom.innerHTML = 'Fechar';

  new Editor({ textarea: playgroundTextarea });

  playgroundTemplate = [
    '\'use strict\';\n\n',
      'function Algorithm () {\n',
        '    this.move = function (availablePositions) {\n',
        '        return availablePositions[0];\n',
      '    }',
    '\n}\n'
  ].join('');

  // set game board attrs
  gameboard.setAttribute('data-interval', .5);
  gameboard.setAttribute('data-rows', 6);
  gameboard.setAttribute('data-columns', 7);
  gameboard.setAttribute('data-players', true);

  // create test board
  testBoard = new GameBoard(gameboard);
  gameboard.appendChild(playgroundTestLogs);
  gameboard.appendChild(closeTestButtom);
  playgroundTestBoard.appendChild(gameboard);

  // set listeners
  testButton.addEventListener('click', testHandler);
  submitButton.addEventListener('click', submitHandler);
  resetButtom.addEventListener('click', resetHandler);
  closeTestButtom.addEventListener('click', closeTestHandler);

  // load player algorithm
  api('/player/' + playgroundTextarea.getAttribute('data-username')).get(loadPlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);
