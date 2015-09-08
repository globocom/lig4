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

	var api = __webpack_require__(1);
	var Editor = __webpack_require__(2);
	var Algorithm = __webpack_require__(3);
	var Game = __webpack_require__(4);
	var GameBoard = __webpack_require__(7);

	// elements and vars

	var testButton;
	var submitButton;
	var resetButtom;
	var closeTestButtom;
	var lastSaveButtom;
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
	var username;

	// functions

	function RandomAlgorithm () {
	  this.move = function(availablePositions) {
	    var index = Math.round((availablePositions.length - 1) * Math.random());

	    return availablePositions[index];
	  };

	  this.username = this.char = 'aleatório';
	}

	function loadPlayerHandler (_player, status) {
	  player = _player;

	  var expiredCode = localStorage.getItem('lig4-' + player.username);

	  if (expiredCode) {
	    localStorage.removeItem('lig4-' + player.username);
	    return playgroundTextarea.value = expiredCode;
	  }

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
	    player.algorithm.char = player.username;

	    game = new Game(player.algorithm, new RandomAlgorithm);
	    result = game.run();
	    result.players = [{
	      username: player.username
	    }, {
	      username: 'aleatório'
	    }];

	    if (result.reason == 'INVALID_MOVE') {
	      throw new Error('The Algorithm returned a invalid column: ' + result.invalidMove + ';');
	    }

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
	          '<b>', play.username, '</b> jogou na coluna <b>', play.move[0], '</b>;',
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

	  if (window.confirm('Carregar o template inicial do algoritmo?')) {
	    playgroundTextarea.value = playgroundTemplate;
	  }
	}

	function submitHandler (e) {
	  e.preventDefault();

	  testButton.disabled = true;
	  submitButton.disabled = true;
	  submitButton.innerHTML = 'Salvando...';

	  if (playgroundTextarea.value.indexOf('console') !== -1 ||
	      playgroundTextarea.value.indexOf('alert') !== -1 ||
	      playgroundTextarea.value.indexOf('const ') !== -1) {
	    testButton.disabled = false;
	    submitButton.innerHTML = 'Salvar';
	    submitButton.disabled = false;

	    return alert('Seu código roda em um ambiente NodeJS restrito, remova todos os console.log(), alert, const e funcionalidades do ES6.');
	  }

	  testAlgorithm(function (err, data) {
	    if (err) {
	      testButton.disabled = false;
	      submitButton.innerHTML = 'Salvar';
	      submitButton.disabled = false;

	      return alert(data);
	    }

	    if (localStorage) {
	      localStorage.setItem('lig4-' + player.username, playgroundTextarea.value);
	    }

	    // save player algorithm
	    api('/player/' + player.username).put({
	      code: playgroundTextarea.value
	  }, function (res, status) {

	      if (status >= 400) {
	          alert('Seu código roda em um ambiente NodeJS restrito, remova todos os console.log(), alert, const e funcionalidades do ES6.')
	      } else {
	          submitButton.innerHTML = 'Salvo c/ sucesso!';
	          localStorage.removeItem('lig4-' + player.username);
	      }
	      testButton.disabled = false;

	      setTimeout(function () {
	        submitButton.disabled = false;
	        submitButton.innerHTML = 'Salvar';
	      }, 1500);
	    }, false);
	  });
	}

	function lastSaveHandler (e) {
	  e.preventDefault();

	  if (window.confirm('Carregar o seu último algoritmo salvo?')) {
	    document.location.reload();
	  }
	}

	// main function
	function playground () {
	  testButton = document.getElementById('test-algorithm-button');
	  closeTestButtom = document.createElement('button');
	  submitButton = document.getElementById('submit-algorithm-button');
	  resetButtom = document.getElementById('reset-algorithm-button');
	  lastSaveButtom = document.getElementById('last-save--button');
	  playgroundEditor = document.getElementById('playground-editor');
	  playgroundWrapper = document.getElementById('playground');
	  playgroundTextarea = document.getElementById('playground-textarea');
	  playgroundRunner = document.getElementById('playground-runner');
	  playgroundTestBoard = document.createElement('div');
	  playgroundTestLogs = document.createElement('ul');
	  gameboard = document.createElement('div');
	  username = playgroundTextarea.getAttribute('data-username');

	  playgroundTestBoard.className = 'playground-test-board';
	  playgroundTestLogs.className = 'playground-test-logs';
	  gameboard.className = 'game-board';
	  closeTestButtom.className = 'button playground__close-test-button';
	  closeTestButtom.innerHTML = 'Fechar';

	  new Editor({ textarea: playgroundTextarea });

	  playgroundTemplate = [

	    '\'use strict\';\n\n',

	    '/*\n',
	    ' * A função Algorithm encapsula \n',
	    ' * a lógica das jogadas. \n',
	    ' * A instância do Algorithm \n',
	    ' * persiste durante toda a partida. \n',
	    ' */ \n\n',

	      'function Algorithm () {\n\n',

	        '    /*\n',
	        '     * Cada chamada de \'move\' \n',
	        '     * corresponde a uma peça jogada. \n',
	        '     * Esse método recebe \n',
	        '     * as colunas disponíveis \n',
	        '     * do tabuleiro e o estado atual \n',
	        '     * do mesmo. \n',
	        '     */ \n\n',

	        '    this.move = function (availableColumns, gameBoard) {\n\n',

	        '        /*\n',
	        '         * Exemplo dos argumentos  \n',
	        '         * passados\n',
	        '         * \n',
	        '         * availableColumns: \n',
	        '         * [0, 1, 2, 3, 4, 5, 6]\n',
	        '         * \n',
	        '         * gameBoard: [\n',
	        '         *  [\'' + username + '\', null, null, null, null, null], \n',
	        '         *  [\'' + username + '\', null, null, null, null, null], \n',
	        '         *  [null, null, null, null, null, null], \n',
	        '         *  [\'' + username + '\', null, null, null, null, null], \n',
	        '         *  [\'aleatório\', null, null, null, null, null], \n',
	        '         *  [\'aleatório\', null, null, null, null, null], \n',
	        '         *  [\'aleatório\', null, null, null, null, null] \n',
	        '         * ] \n',
	        '         */ \n\n',

	        '        /*\n',
	        '         * O retorno do método \n',
	        '         * deve ser o índice númerico \n',
	        '         * de uma coluna válida, \n',
	        '         * para que a jogada seja \n',
	        '         * realizada com sucesso. \n',
	        '         */\n\n',

	        '        return availableColumns[0];\n',
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
	  lastSaveButtom.addEventListener('click', lastSaveHandler);
	  closeTestButtom.addEventListener('click', closeTestHandler);

	  // load player algorithm
	  api('/player/' + username).get(loadPlayerHandler);
	}

	document.addEventListener('DOMContentLoaded', playground);


/***/ },
/* 1 */
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var BehaveHooks = BehaveHooks || (function(){
	    var hooks = {};

	    return {
	        add: function(hookName, fn){
	            if(typeof hookName == "object"){
	                var i;
	                for(i=0; i<hookName.length; i++){
	                    var theHook = hookName[i];
	                    if(!hooks[theHook]){
	                        hooks[theHook] = [];
	                    }
	                    hooks[theHook].push(fn);
	                }
	            } else {
	                if(!hooks[hookName]){
	                    hooks[hookName] = [];
	                }
	                hooks[hookName].push(fn);
	            }
	        },
	        get: function(hookName){
	            if(hooks[hookName]){
	                return hooks[hookName];
	            }
	        }
	    };

	})(),
	Behave = Behave || function (userOpts) {

	    if (typeof String.prototype.repeat !== 'function') {
	        String.prototype.repeat = function(times) {
	            if(times < 1){
	                return '';
	            }
	            if(times % 2){
	                return this.repeat(times - 1) + this;
	            }
	            var half = this.repeat(times / 2);
	            return half + half;
	        };
	    }

	    if (typeof Array.prototype.filter !== 'function') {
	        Array.prototype.filter = function(func /*, thisp */) {
	            if (this === null) {
	                throw new TypeError();
	            }

	            var t = Object(this),
	                len = t.length >>> 0;
	            if (typeof func != "function"){
	                throw new TypeError();
	            }
	            var res = [],
	                thisp = arguments[1];
	            for (var i = 0; i < len; i++) {
	                if (i in t) {
	                    var val = t[i];
	                    if (func.call(thisp, val, i, t)) {
	                        res.push(val);
	                    }
	                }
	            }
	            return res;
	        };
	    }

	    var defaults = {
	        textarea: null,
	        replaceTab: true,
	        softTabs: true,
	        tabSize: 4,
	        autoOpen: true,
	        overwrite: true,
	        autoStrip: true,
	        autoIndent: true,
	        fence: false
	    },
	    tab,
	    newLine,
	    charSettings = {

	        keyMap: [
	            { open: "\"", close: "\"", canBreak: false },
	            { open: "'", close: "'", canBreak: false },
	            { open: "(", close: ")", canBreak: false },
	            { open: "[", close: "]", canBreak: true },
	            { open: "{", close: "}", canBreak: true }
	        ]

	    },
	    utils = {

	        _callHook: function(hookName, passData){
	            var hooks = BehaveHooks.get(hookName);
	            passData = typeof passData=="boolean" && passData === false ? false : true;

	            if(hooks){
	                if(passData){
	                    var theEditor = defaults.textarea,
	                        textVal = theEditor.value,
	                        caretPos = utils.cursor.get(),
	                        i;

	                    for(i=0; i<hooks.length; i++){
	                        hooks[i].call(undefined, {
	                            editor: {
	                                element: theEditor,
	                                text: textVal,
	                                levelsDeep: utils.levelsDeep()
	                            },
	                            caret: {
	                                pos: caretPos
	                            },
	                            lines: {
	                                current: utils.cursor.getLine(textVal, caretPos),
	                                total: utils.editor.getLines(textVal)
	                            }
	                        });
	                    }
	                } else {
	                    for(i=0; i<hooks.length; i++){
	                        hooks[i].call(undefined);
	                    }
	                }
	            }
	        },

	        defineNewLine: function(){
	            var ta = document.createElement('textarea');
	            ta.value = "\n";

	            if(ta.value.length==2){
	                newLine = "\r\n";
	            } else {
	                newLine = "\n";
	            }
	        },
	        defineTabSize: function(tabSize){
	            if(typeof defaults.textarea.style.OTabSize != "undefined"){
	                defaults.textarea.style.OTabSize = tabSize; return;
	            }
	            if(typeof defaults.textarea.style.MozTabSize != "undefined"){
	                defaults.textarea.style.MozTabSize = tabSize; return;
	            }
	            if(typeof defaults.textarea.style.tabSize != "undefined"){
	                defaults.textarea.style.tabSize = tabSize; return;
	            }
	        },
	        cursor: {
	            getLine: function(textVal, pos){
	                return ((textVal.substring(0,pos)).split("\n")).length;
	            },
	            get: function() {

	                if (typeof document.createElement('textarea').selectionStart==="number") {
	                    return defaults.textarea.selectionStart;
	                } else if (document.selection) {
	                    var caretPos = 0,
	                        range = defaults.textarea.createTextRange(),
	                        rangeDupe = document.selection.createRange().duplicate(),
	                        rangeDupeBookmark = rangeDupe.getBookmark();
	                    range.moveToBookmark(rangeDupeBookmark);

	                    while (range.moveStart('character' , -1) !== 0) {
	                        caretPos++;
	                    }
	                    return caretPos;
	                }
	            },
	            set: function (start, end) {
	                if(!end){
	                    end = start;
	                }
	                if (defaults.textarea.setSelectionRange) {
	                    defaults.textarea.focus();
	                    defaults.textarea.setSelectionRange(start, end);
	                } else if (defaults.textarea.createTextRange) {
	                    var range = defaults.textarea.createTextRange();
	                    range.collapse(true);
	                    range.moveEnd('character', end);
	                    range.moveStart('character', start);
	                    range.select();
	                }
	            },
	            selection: function(){
	                var textAreaElement = defaults.textarea,
	                    start = 0,
	                    end = 0,
	                    normalizedValue,
	                    range,
	                    textInputRange,
	                    len,
	                    endRange;

	                if (typeof textAreaElement.selectionStart == "number" && typeof textAreaElement.selectionEnd == "number") {
	                    start = textAreaElement.selectionStart;
	                    end = textAreaElement.selectionEnd;
	                } else {
	                    range = document.selection.createRange();

	                    if (range && range.parentElement() == textAreaElement) {

	                        normalizedValue = utils.editor.get();
	                        len = normalizedValue.length;

	                        textInputRange = textAreaElement.createTextRange();
	                        textInputRange.moveToBookmark(range.getBookmark());

	                        endRange = textAreaElement.createTextRange();
	                        endRange.collapse(false);

	                        if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
	                            start = end = len;
	                        } else {
	                            start = -textInputRange.moveStart("character", -len);
	                            start += normalizedValue.slice(0, start).split(newLine).length - 1;

	                            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
	                                end = len;
	                            } else {
	                                end = -textInputRange.moveEnd("character", -len);
	                                end += normalizedValue.slice(0, end).split(newLine).length - 1;
	                            }
	                        }
	                    }
	                }

	                return start==end ? false : {
	                    start: start,
	                    end: end
	                };
	            }
	        },
	        editor: {
	            getLines: function(textVal){
	                return (textVal).split("\n").length;
	            },
	            get: function(){
	                return defaults.textarea.value.replace(/\r/g,'');
	            },
	            set: function(data){
	                defaults.textarea.value = data;
	            }
	        },
	        fenceRange: function(){
	            if(typeof defaults.fence == "string"){

	                var data = utils.editor.get(),
	                    pos = utils.cursor.get(),
	                    hacked = 0,
	                    matchedFence = data.indexOf(defaults.fence),
	                    matchCase = 0;

	                while(matchedFence>=0){
	                    matchCase++;
	                    if( pos < (matchedFence+hacked) ){
	                        break;
	                    }

	                    hacked += matchedFence+defaults.fence.length;
	                    data = data.substring(matchedFence+defaults.fence.length);
	                    matchedFence = data.indexOf(defaults.fence);

	                }

	                if( (hacked) < pos && ( (matchedFence+hacked) > pos ) && matchCase%2===0){
	                    return true;
	                }
	                return false;
	            } else {
	                return true;
	            }
	        },
	        isEven: function(_this,i){
	            return i%2;
	        },
	        levelsDeep: function(){
	            var pos = utils.cursor.get(),
	                val = utils.editor.get();

	            var left = val.substring(0, pos),
	                levels = 0,
	                i, j;

	            for(i=0; i<left.length; i++){
	                for (j=0; j<charSettings.keyMap.length; j++) {
	                    if(charSettings.keyMap[j].canBreak){
	                        if(charSettings.keyMap[j].open == left.charAt(i)){
	                            levels++;
	                        }

	                        if(charSettings.keyMap[j].close == left.charAt(i)){
	                            levels--;
	                        }
	                    }
	                }
	            }

	            var toDecrement = 0,
	                quoteMap = ["'", "\""];
	            for(i=0; i<charSettings.keyMap.length; i++) {
	                if(charSettings.keyMap[i].canBreak){
	                    for(j in quoteMap){
	                        toDecrement += left.split(quoteMap[j]).filter(utils.isEven).join('').split(charSettings.keyMap[i].open).length - 1;
	                    }
	                }
	            }

	            var finalLevels = levels - toDecrement;

	            return finalLevels >=0 ? finalLevels : 0;
	        },
	        deepExtend: function(destination, source) {
	            for (var property in source) {
	                if (source[property] && source[property].constructor &&
	                    source[property].constructor === Object) {
	                    destination[property] = destination[property] || {};
	                    utils.deepExtend(destination[property], source[property]);
	                } else {
	                    destination[property] = source[property];
	                }
	            }
	            return destination;
	        },
	        addEvent: function addEvent(element, eventName, func) {
	            if (element.addEventListener){
	                element.addEventListener(eventName,func,false);
	            } else if (element.attachEvent) {
	                element.attachEvent("on"+eventName, func);
	            }
	        },
	        removeEvent: function addEvent(element, eventName, func){
	            if (element.addEventListener){
	                element.removeEventListener(eventName,func,false);
	            } else if (element.attachEvent) {
	                element.detachEvent("on"+eventName, func);
	            }
	        },

	        preventDefaultEvent: function(e){
	            if(e.preventDefault){
	                e.preventDefault();
	            } else {
	                e.returnValue = false;
	            }
	        }
	    },
	    intercept = {
	        tabKey: function (e) {

	            if(!utils.fenceRange()){ return; }

	            if (e.keyCode == 9) {
	                utils.preventDefaultEvent(e);

	                var toReturn = true;
	                utils._callHook('tab:before');

	                var selection = utils.cursor.selection(),
	                    pos = utils.cursor.get(),
	                    val = utils.editor.get();

	                if(selection){

	                    var tempStart = selection.start;
	                    while(tempStart--){
	                        if(val.charAt(tempStart)=="\n"){
	                            selection.start = tempStart + 1;
	                            break;
	                        }
	                    }

	                    var toIndent = val.substring(selection.start, selection.end),
	                        lines = toIndent.split("\n"),
	                        i;

	                    if(e.shiftKey){
	                        for(i = 0; i<lines.length; i++){
	                            if(lines[i].substring(0,tab.length) == tab){
	                                lines[i] = lines[i].substring(tab.length);
	                            }
	                        }
	                        toIndent = lines.join("\n");

	                        utils.editor.set( val.substring(0,selection.start) + toIndent + val.substring(selection.end) );
	                        utils.cursor.set(selection.start, selection.start+toIndent.length);

	                    } else {
	                        for(i in lines){
	                            lines[i] = tab + lines[i];
	                        }
	                        toIndent = lines.join("\n");

	                        utils.editor.set( val.substring(0,selection.start) + toIndent + val.substring(selection.end) );
	                        utils.cursor.set(selection.start, selection.start+toIndent.length);
	                    }
	                } else {
	                    var left = val.substring(0, pos),
	                        right = val.substring(pos),
	                        edited = left + tab + right;

	                    if(e.shiftKey){
	                        if(val.substring(pos-tab.length, pos) == tab){
	                            edited = val.substring(0, pos-tab.length) + right;
	                            utils.editor.set(edited);
	                            utils.cursor.set(pos-tab.length);
	                        }
	                    } else {
	                        utils.editor.set(edited);
	                        utils.cursor.set(pos + tab.length);
	                        toReturn = false;
	                    }
	                }
	                utils._callHook('tab:after');
	            }
	            return toReturn;
	        },
	        enterKey: function (e) {

	            if(!utils.fenceRange()){ return; }

	            if (e.keyCode == 13) {

	                utils.preventDefaultEvent(e);
	                utils._callHook('enter:before');

	                var pos = utils.cursor.get(),
	                    val = utils.editor.get(),
	                    left = val.substring(0, pos),
	                    right = val.substring(pos),
	                    leftChar = left.charAt(left.length - 1),
	                    rightChar = right.charAt(0),
	                    numTabs = utils.levelsDeep(),
	                    ourIndent = "",
	                    closingBreak = "",
	                    finalCursorPos,
	                    i;
	                if(!numTabs){
	                    finalCursorPos = 1;
	                } else {
	                    while(numTabs--){
	                        ourIndent+=tab;
	                    }
	                    ourIndent = ourIndent;
	                    finalCursorPos = ourIndent.length + 1;

	                    for(i=0; i<charSettings.keyMap.length; i++) {
	                        if (charSettings.keyMap[i].open == leftChar && charSettings.keyMap[i].close == rightChar){
	                            closingBreak = newLine;
	                        }
	                    }

	                }

	                var edited = left + newLine + ourIndent + closingBreak + (ourIndent.substring(0, ourIndent.length-tab.length) ) + right;
	                utils.editor.set(edited);
	                utils.cursor.set(pos + finalCursorPos);
	                utils._callHook('enter:after');
	            }
	        },
	        deleteKey: function (e) {

	            if(!utils.fenceRange()){ return; }

	            if(e.keyCode == 8){
	                utils.preventDefaultEvent(e);

	                utils._callHook('delete:before');

	                var pos = utils.cursor.get(),
	                    val = utils.editor.get(),
	                    left = val.substring(0, pos),
	                    right = val.substring(pos),
	                    leftChar = left.charAt(left.length - 1),
	                    rightChar = right.charAt(0),
	                    i;

	                if( utils.cursor.selection() === false ){
	                    for(i=0; i<charSettings.keyMap.length; i++) {
	                        if (charSettings.keyMap[i].open == leftChar && charSettings.keyMap[i].close == rightChar) {
	                            var edited = val.substring(0,pos-1) + val.substring(pos+1);
	                            utils.editor.set(edited);
	                            utils.cursor.set(pos - 1);
	                            return;
	                        }
	                    }
	                    var edited = val.substring(0,pos-1) + val.substring(pos);
	                    utils.editor.set(edited);
	                    utils.cursor.set(pos - 1);
	                } else {
	                    var sel = utils.cursor.selection(),
	                        edited = val.substring(0,sel.start) + val.substring(sel.end);
	                    utils.editor.set(edited);
	                    utils.cursor.set(pos);
	                }

	                utils._callHook('delete:after');

	            }
	        }
	    },
	    charFuncs = {
	        openedChar: function (_char, e) {
	            utils.preventDefaultEvent(e);
	            utils._callHook('openChar:before');
	            var pos = utils.cursor.get(),
	                val = utils.editor.get(),
	                left = val.substring(0, pos),
	                right = val.substring(pos),
	                edited = left + _char.open + _char.close + right;

	            defaults.textarea.value = edited;
	            utils.cursor.set(pos + 1);
	            utils._callHook('openChar:after');
	        },
	        closedChar: function (_char, e) {
	            var pos = utils.cursor.get(),
	                val = utils.editor.get(),
	                toOverwrite = val.substring(pos, pos + 1);
	            if (toOverwrite == _char.close) {
	                utils.preventDefaultEvent(e);
	                utils._callHook('closeChar:before');
	                utils.cursor.set(utils.cursor.get() + 1);
	                utils._callHook('closeChar:after');
	                return true;
	            }
	            return false;
	        }
	    },
	    action = {
	        filter: function (e) {

	            if(!utils.fenceRange()){ return; }

	            var theCode = e.which || e.keyCode;

	            if(theCode == 39 || theCode == 40 && e.which===0){ return; }

	            var _char = String.fromCharCode(theCode),
	                i;

	            for(i=0; i<charSettings.keyMap.length; i++) {

	                if (charSettings.keyMap[i].close == _char) {
	                    var didClose = defaults.overwrite && charFuncs.closedChar(charSettings.keyMap[i], e);

	                    if (!didClose && charSettings.keyMap[i].open == _char && defaults.autoOpen) {
	                        charFuncs.openedChar(charSettings.keyMap[i], e);
	                    }
	                } else if (charSettings.keyMap[i].open == _char && defaults.autoOpen) {
	                    charFuncs.openedChar(charSettings.keyMap[i], e);
	                }
	            }
	        },
	        listen: function () {

	            if(defaults.replaceTab){ utils.addEvent(defaults.textarea, 'keydown', intercept.tabKey); }
	            if(defaults.autoIndent){ utils.addEvent(defaults.textarea, 'keydown', intercept.enterKey); }
	            if(defaults.autoStrip){ utils.addEvent(defaults.textarea, 'keydown', intercept.deleteKey); }

	            utils.addEvent(defaults.textarea, 'keypress', action.filter);

	            utils.addEvent(defaults.textarea, 'keydown', function(){ utils._callHook('keydown'); });
	            utils.addEvent(defaults.textarea, 'keyup', function(){ utils._callHook('keyup'); });
	        }
	    },
	    init = function (opts) {

	        if(opts.textarea){
	            utils._callHook('init:before', false);
	            utils.deepExtend(defaults, opts);
	            utils.defineNewLine();

	            if (defaults.softTabs) {
	                tab = " ".repeat(defaults.tabSize);
	            } else {
	                tab = "\t";

	                utils.defineTabSize(defaults.tabSize);
	            }

	            action.listen();
	            utils._callHook('init:after', false);
	        }

	    };

	    this.destroy = function(){
	        utils.removeEvent(defaults.textarea, 'keydown', intercept.tabKey);
	        utils.removeEvent(defaults.textarea, 'keydown', intercept.enterKey);
	        utils.removeEvent(defaults.textarea, 'keydown', intercept.deleteKey);
	        utils.removeEvent(defaults.textarea, 'keypress', action.filter);
	    };

	    init(userOpts);

	};

	if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Behave;
	}

	if (typeof ender === 'undefined') {
	    this.Behave = Behave;
	    this.BehaveHooks = BehaveHooks;
	}

	if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return Behave;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var availableColumnsMock = [0, 1, 2, 3, 4, 5, 6];
	var availableBoardMock = [
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null],
	    [null, null, null, null, null, null]
	];

	function Algorithm(algorithmSource) {
	  if (algorithmSource.indexOf('function') == -1 ||
	    algorithmSource.indexOf('Algorithm') == -1) {
	    throw new Error('You need to have a \'Algorithm\' function;');
	  }

	  this.constructor = (new Function('window', 'document', algorithmSource + ' ;return Algorithm;')).call({}, {}, {});

	  if (!this.constructor || typeof this.constructor !== 'function') {
	    throw new Error('Invalid return statement;');
	  }

	  this.instance = new this.constructor();

	  if (!this.instance.move || typeof this.instance.move !== 'function') {
	    throw new Error('The Algorithm need to have a move method to make the plays;');
	  }

	  if (typeof this.instance.move(availableColumnsMock, availableBoardMock) !== 'number') {
	    throw new Error('The Algorithm move method should return a number;');
	  }

	  return new this.constructor();
	}

	module.exports = Algorithm;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Board = __webpack_require__(5);

	function Game(player1, player2) {
	  this.board = new Board();
	  this.players = [player1, player2];
	}

	Game.status = {
	  INVALID_MOVE: 'INVALID_MOVE',
	  LIG4: 'LIG4',
	  DRAW: 'DRAW'
	};

	Game.prototype.run = function () {
	  var result = {
	    winner: null,
	    reason: null,
	    moves: [],
	    sequence: []
	  };

	  for (var play = 0; play < this.board.maxMoves; play++) {
	    var currentPlayer = this.players[play % 2];
	    var columns = this.board.getAvailableColumns();
	    var currentBoard = this.board.cloneBoard();
	    var column = currentPlayer.move(columns, currentBoard);

	    if (columns.indexOf(column) < 0) {
	      result.winner = this.players[(play + 1) % 2];
	      result.reason = Game.status.INVALID_MOVE;
	      result.invalidMove = column;
	      break;
	    };

	    var move = this.board.push(currentPlayer, column);
	    result.moves.push({
	      username: currentPlayer.username,
	      move: move
	    });

	    var matchSequence = this.matchAnalyzer();
	    if (matchSequence) {
	      result.winner = currentPlayer;
	      result.reason = Game.status.LIG4;
	      result.sequence = matchSequence;
	      break;
	    }
	  };

	  if (!result.winner) result.reason = Game.status.DRAW;

	  return result;
	};

	Game.prototype.matchAnalyzer = function () {
	  var match = null;

	  for (var column = 0; column < this.board.width; column++) {
	    var columns = this.board.matrix[column];

	    if (match) {
	      break;
	    }

	    for (var row = 0; row < this.board.height; row++) {
	      var position = columns[row];

	      if (position == null) {
	        continue;
	      }

	      // vertical
	      if (columns[row + 1] == position &&
	        columns[row + 2] == position &&
	        columns[row + 3] == position) {
	        match = [[column, row], [column, row + 1],
	                 [column, row + 2], [column, row + 3]]
	        break;
	      }

	      // horizontal
	      if (this.board.matrix[column] &&
	        this.board.matrix[column + 3] &&
	        this.board.matrix[column + 1][row] == position &&
	        this.board.matrix[column + 2][row] == position &&
	        this.board.matrix[column + 3][row] == position) {
	        match = [[column, row], [column + 1, row],
	                 [column + 2, row], [column + 3, row]]
	        break;
	      }

	      // diagonal right
	      if (this.board.matrix[column] &&
	        this.board.matrix[column + 3] &&
	        this.board.matrix[column + 1][row + 1] == position &&
	        this.board.matrix[column + 2][row + 2] == position &&
	        this.board.matrix[column + 3][row + 3] == position) {
	        match = [[column, row], [column + 1, row + 1],
	                 [column + 2, row + 2], [column + 3, row + 3]]
	        break;
	      }
	      // diagonal left
	      if (this.board.matrix[column] &&
	        this.board.matrix[column + 3] &&
	        this.board.matrix[column + 1][row - 1] == position &&
	        this.board.matrix[column + 2][row - 2] == position &&
	        this.board.matrix[column + 3][row - 3] == position) {
	        match = [[column, row], [column + 1, row - 1],
	                 [column + 2, row - 2], [column + 3, row - 3]]
	        break;
	      }


	    };
	  };

	  return match;
	};


	module.exports = Game;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {function Board() {
	  this.width = 7;
	  this.height = 6;
	  this.maxMoves = this.width * this.height;
	  this.matrix = this.buildMatrix();
	}

	Board.prototype.push = function (player, column) {
	  var row = this.matrix[column].lastIndexOf(null);

	  if (row < 0) return false;

	  this.matrix[column][row] = player.char;

	  return [column, row];
	};

	Board.prototype.cloneBoard = function () {

	  var clone = [];
	  for (var column in this.matrix) {
	    clone.push(this.matrix[column].slice(0))
	  }
	  return clone;
	};

	Board.prototype.buildMatrix = function () {
	  var matrix = [];

	  for (var i = 0; i < this.width; i++) { // columns
	    matrix[i] = []
	    for (var j = 0; j < this.height; j++) { // rows
	      matrix[i][j] = null;
	    }
	  }

	  return matrix
	};

	Board.prototype.getAvailableColumns = function () {
	  var positions = [];

	  for (var column in this.matrix) {
	    if (this.matrix[column].lastIndexOf(null) >= 0)
	      positions.push(parseInt(column));
	  }

	  return positions;
	}

	Board.prototype.draw = function () {
	  for (var row = 0; row < this.height; row++) {
	    for (var column = 0; column < this.width; column++) {
	      var cell = this.matrix[column][row] || ' ';
	      process.stdout.write("| " + cell + " ");
	    }
	    process.stdout.write("\n");
	  }
	};

	module.exports = Board;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
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


/***/ }
/******/ ]);