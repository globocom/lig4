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
      if (status !== 200) alert('Error: ' + res.message);

      // unset state
      setTimeout(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submeter algoritmo';
      }, 1000);
    });
  } catch (error) {
    alert(error.message);
  }
}

function savePlayerHandler () {
  if (timeout) clearTimeout(timeout);

  // debounce
  timeout = setTimeout(function () {
    try {
      // test algorithm
      new Algorithm(editor.getValue());

      // save draft
      Api('/player/' + player.username).put({
        code: editor.getValue()
      }, function (res, status) {
        if (status !== 200) alert('Error: ' + res.message);
      });
    } catch (error) {
      throw new Error(error);
    }
  }, 500);
}

function loadPlayerHandler (data) {
  // data.draft
  editor.setValue(data.code, -1);
}

function resetPlayerHandler (e) {
  e.preventDefault();

  if (!window.confirm('Deseja carregar o último algoritmo submetido?')) return;

  editor.setValue(template, -1);
}

function restorePlayerHandler (e) {
  e.preventDefault();

  if (window.confirm('Deseja carregar o template inicial?')) return;

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
