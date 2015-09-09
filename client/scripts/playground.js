'use strict';

// imports
var api = require('./libs/api');
var ace = require('brace');

require('brace/mode/javascript');
require('brace/theme/monokai');

var player = {};
var editor;
var template;

// elements
var editorElement;
var testButton;
var submitButton;
var resetButtom;

function savePlayerHandler (e) {
  e.preventDefault();

  testButton.disabled = true;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Salvando...';

  if (localStorage) localStorage.setItem('lig4-' + player.username, editor.getValue());

  api('/player/' + player.username).put({
    code: editor.getValue()
  }, function (res, status) {
    if (status !== 200) alert(res);
    if (localStorage) localStorage.removeItem('lig4-' + player.username);

    testButton.disabled = false;
    submitButton.disabled = false;
    submitButton.innerHTML = 'Salvar algoritmo';
  });
}

function loadPlayerHandler (data, status) {
  var code = data.code;
  var localCode = null;

  if (localStorage) localCode = localStorage.getItem('lig4-' + player.username);
  if (localCode) code = localCode;

  editor.setValue(code, -1);
}

function resetPlayerHandler (e) {
  e.preventDefault();
  console.log(123);
  editor.setValue(template, -1);
}

// main function
function playground () {
  // bind elements
  editorElement = document.getElementById('editor');
  testButton = document.getElementById('test-button');
  submitButton = document.getElementById('submit-button');
  resetButtom = document.getElementById('reset-button');

  // set editor
  editor = ace.edit('editor');
  editor.setTheme('ace/theme/monokai');
  editor.getSession().setMode('ace/mode/javascript');
  template = editor.getValue();
  editor.setOptions({
    hScrollBarAlwaysVisible: false,
    vScrollBarAlwaysVisible: false,
    highlightGutterLine: false,
    animatedScroll: false,
    showInvisibles: false,
    showPrintMargin: false,
    printMarginColumn: false,
    printMargin: false,
    showLineNumbers: false,
    showGutter: false,
    displayIndentGuides: false,
    maxLines: false,
    minLines: false,
    highlightActiveLine: false,
    fixedWidthGutter: false,
    fontSize: '16px',
  });

  // set data
  player.username = editorElement.getAttribute('data-username');

  // load player algorithm
  api('/player/' + player.username).get(loadPlayerHandler);
  console.log(resetButtom);
  // bind listeners
  resetButtom.addEventListener('click', resetPlayerHandler);
  submitButton.addEventListener('click', savePlayerHandler);
}

document.addEventListener('DOMContentLoaded', playground);
