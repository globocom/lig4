'use strict';

// imports
var api = require('./libs/api');
var Editor = require('./libs/editor');

// elements and vars
var testButton;
var submitButton;
var playgroundTextarea;
var playgroundRunner;
var playgroundTemplate;
var player;

// functions

function loadPlayerHandler(_player, status) {
  player = _player;

  console.log(player);

  if (status == 204) {
    return playgroundTextarea.value = playgroundTemplate;
  }

  playgroundTextarea.value = player.code;
}

function testHandler (e) {
  e.preventDefault();
}

function submitHandler (e) {
  e.preventDefault();

  // put player algorithm
  api('/player/' + player.username).put({
    code: playgroundTextarea.value
  }, function (res, status) {
    console.log(res, status)
  });
}

function validateHandler () {
  var algorithm = playgroundTextarea.value;

  if (algorithm.indexOf('Player') == -1 ||
      algorithm.indexOf('function') == -1 ||
      algorithm.indexOf('(') == -1 ||
      algorithm.indexOf(')') == -1 ||
      algorithm.indexOf('{') == -1 ||
      algorithm.indexOf('}') == -1 ||
      algorithm.indexOf('return') == -1 ||
      algorithm.indexOf('return Player') == -1 ||
      algorithm.indexOf('move') == -1) {

    return submitButton.disabled = true;
  }

  submitButton.disabled = false;
}

// main function
function playground () {
  testButton = document.getElementById('test-algorithm-button');
  submitButton = document.getElementById('submit-algorithm-button');
  playgroundTextarea = document.getElementById('playground-textarea');
  playgroundRunner = document.getElementById('playground-runner');

  var editor = new Editor({
      textarea: playgroundTextarea,
      replaceTab: false,
      softTabs: false,
      tabSize: 4,
      autoOpen: true,
      overwrite: true,
      autoStrip: true,
      autoIndent: true,
  });

  playgroundTemplate = [
    '\'use strict\';\n\n',
      'function Player () {\n',
        '\tthis.move = function (avaiblePositions) {\n',
        '\t\treturn avaiblePositions[0];\n',
      '\t}',
    '\n}\n'
  ].join('');

  // set listeners
  testButton.addEventListener('click', testHandler);
  submitButton.addEventListener('click', submitHandler);
  playgroundTextarea.addEventListener('keyup', validateHandler);

  // load player algorithm
  api('/player/' + playgroundTextarea.getAttribute('data-username')).get(loadPlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);