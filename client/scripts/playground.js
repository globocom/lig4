'use strict';

// imports
var api = require('./libs/api');
var Editor = require('./libs/editor');
var Algorithm = require('./libs/algorithm');

// elements and vars
var testButton;
var submitButton;
var resetButtom;
var playgroundTextarea;
var playgroundRunner;
var playgroundTemplate;
var player;

// functions

function loadPlayerHandler(_player, status) {
  player = _player;

  if (!player.code) {
    return playgroundTextarea.value = playgroundTemplate;
  }

  playgroundTextarea.value = player.code;
}

function testHandler (e) {
  e.preventDefault();

  player.algorithm = new Algorithm(playgroundTextarea.value);
  player.algorithm.validate();

  // get logs from execute player algorithm agaisnt randon algorithm
  // player.algorithm.play();
}

function resetHandler (e) {
  e.preventDefault();

  playgroundTextarea.value = playgroundTemplate;
}

function submitHandler (e) {
  e.preventDefault();

  // put player algorithm
  api('/player/' + player.username).put({
    code: playgroundTextarea.value
  }, function (res, status) {
    console.log(res, status);
  });
}

// main function
function playground () {
  testButton = document.getElementById('test-algorithm-button');
  submitButton = document.getElementById('submit-algorithm-button');
  resetButtom = document.getElementById('reset-algorithm-button');
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
      'function Algorithm () {\n',
        '\tthis.move = function (avaiblePositions) {\n',
        '\t\treturn avaiblePositions[0];\n',
      '\t}',
    '\n}\n',
    '\nreturn Algorithm;\n'
  ].join('');

  // set listeners
  testButton.addEventListener('click', testHandler);
  submitButton.addEventListener('click', submitHandler);
  console.log(resetButtom);
  resetButtom.addEventListener('click', resetHandler);

  // load player algorithm
  api('/player/' + playgroundTextarea.getAttribute('data-username')).get(loadPlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);