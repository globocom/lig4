'use strict';

// imports
var Api = require('./libs/api');
var Algorithm = require('./libs/algorithm');
var TestBoard = require('./components/testboard');

require('./components/editor');

var player = {};
var editor;
var testBoard;
var template;
var timeout;

// elements
var editorElement;
var testButton;
var submitButton;
var resetButtom;
var restoreButtom;

function submitPlayerHandler (e) {
  e.preventDefault();

  if (!window.confirm('Deseja submeter o algoritmo atual para o desafio?')) return;

  // set state
  submitButton.disabled = true;
  submitButton.innerHTML = 'Enviando...';

  try {
    // test algorithm
    new Algorithm(editor.getValue());

    // save algorithm
    Api('/player/' + player.username).put({
      code: editor.getValue()
    }, function (res, status) {
      var timer = 1000;

      if (status !== 200) {
        timer = 0;
        alert('Error: ' + res);
      }

      // unset state
      setTimeout(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submeter algoritmo';
      }, timer);
    });
  } catch (error) {
    // unset state
    submitButton.disabled = false;
    submitButton.innerHTML = 'Submeter algoritmo';

    alert(error.message);
  }
}

function savePlayerHandler () {
  if (timeout) clearTimeout(timeout);

  // debounce
  timeout = setTimeout(function () {
    // save draft
    Api('/player/draft/' + player.username).put({
      draft: editor.getValue()
    }, function (res, status) {
      if (status !== 200) alert('Error: ' + res.message);
    });
  }, 500);
}

function loadPlayerHandler (data) {
  if (data.draft && editor.getValue().length > 1) {
    editor.setValue(data.draft, -1);
  }
}

function resetPlayerHandler (e) {
  e.preventDefault();

  if (!window.confirm('Deseja carregar o template inicial?')) return;

  editor.setValue(template, -1);
}

function restorePlayerHandler (e) {
  e.preventDefault();

  if (!window.confirm('Deseja carregar o último algoritmo submetido?')) return;

  Api('/player/' + player.username).get(function (data) {
    editor.setValue(data.code, -1);
  });
}

function testPlayerHandler (e) {
  e.preventDefault();

  // test algorithm
  try {
    player.algorithm = new Algorithm(editor.getValue());
    player.algorithm.username = player.username;
    player.algorithm.char = player.username;

    // open test board
    testBoard.open(player.algorithm);
  } catch (error) {
    alert(error.message);
  }
}

// main function
function playground () {
  // bind elements
  editorElement = document.getElementById('editor');
  testButton = document.getElementById('test-button');
  submitButton = document.getElementById('submit-button');
  resetButtom = document.getElementById('reset-button');
  restoreButtom = document.getElementById('restore-button');

  // test board
  testBoard = new TestBoard();

  // editor
  editor = ace.edit('editor');
  editor.setTheme('ace/theme/monokai');
  editor.getSession().setMode('ace/mode/javascript');
  editor.getSession().setUseWorker(false);
  editor.getSession().on('change', savePlayerHandler);
  editor.$blockScrolling = Infinity;
  editor.setOptions({
    hScrollBarAlwaysVisible: false,
    vScrollBarAlwaysVisible: false,
    highlightGutterLine: false,
    animatedScroll: false,
    showInvisibles: false,
    showPrintMargin: false,
    printMarginColumn: false,
    printMargin: false,
    showLineNumbers: true,
    showGutter: true,
    displayIndentGuides: false,
    maxLines: false,
    minLines: false,
    highlightActiveLine: false,
    fixedWidthGutter: false,
    fontSize: '16px',
  });

  // set data
  player.username = editorElement.getAttribute('data-username');
  template = editor.getValue();

  // load player algorithm
  Api('/player/' + player.username).get(loadPlayerHandler);

  // bind listeners
  resetButtom.addEventListener('click', resetPlayerHandler);
  restoreButtom.addEventListener('click', restorePlayerHandler);
  submitButton.addEventListener('click', submitPlayerHandler);
  testButton.addEventListener('click', testPlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);
