'use strict';

// imports
var api = require('./libs/api');
var Editor = require('./libs/editor');
var Algorithm = require('./libs/algorithm');
var Game = require('../../engine/game');

// elements and vars
var testButton;
var submitButton;
var resetButtom;
var playgroundTextarea;
var playgroundRunner;
var playgroundTemplate;
var player;

// functions

function RandomAlgorithm () {
  this.move = function(availablePositions) {
    var index = Math.round((availablePositions.length - 1) * Math.random());

    return availablePositions[index];
  };

  this.char = 'R';
  this.username = 'RandomAlgorithm';
}

function loadPlayerHandler (_player, status) {
  player = _player;

  if (!player.code) {
    return playgroundTextarea.value = playgroundTemplate;
  }

  playgroundTextarea.value = player.code;
}

function testAlgorithm (callback) {
  var game = null;
  var result = null;

  try {
    player.algorithm = new Algorithm(playgroundTextarea.value);
    player.algorithm.username = 'PlayerAlgorithm';
    player.algorithm.char = 'P';

    game = new Game(player.algorithm, new RandomAlgorithm);
    result = game.run();

    callback(false, result);
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
    console.log('Ganhou: ' + data.winner.username);
    console.log('Movimentos:', data.moves);
    console.log('Sequencia:', data.sequence);
    testButton.innerHTML = 'Testar';
    testButton.disabled = false;

    alert('Olhe o seu console: W.I.P');
  });
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
      testButton.disabled = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'Salvo c/ sucesso!';

      setTimeout(function () {
        submitButton.innerHTML = 'Salvar';
      }, 2500);
    });
  });
}

// main function
function playground () {
  testButton = document.getElementById('test-algorithm-button');
  submitButton = document.getElementById('submit-algorithm-button');
  resetButtom = document.getElementById('reset-algorithm-button');
  playgroundTextarea = document.getElementById('playground-textarea');
  playgroundRunner = document.getElementById('playground-runner');

  new Editor({ textarea: playgroundTextarea });

  playgroundTemplate = [
    '\'use strict\';\n\n',
      'function Algorithm () {\n',
        '    this.move = function (avaiblePositions) {\n',
        '        return avaiblePositions[0];\n',
      '    }',
    '\n}\n',
    '\nreturn Algorithm;\n'
  ].join('');

  // set listeners
  testButton.addEventListener('click', testHandler);
  submitButton.addEventListener('click', submitHandler);
  resetButtom.addEventListener('click', resetHandler);

  // load player algorithm
  api('/player/' + playgroundTextarea.getAttribute('data-username')).get(loadPlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);