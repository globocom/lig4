!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={exports:{},id:r,loaded:!1};return e[r].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(){this.move=function(e){var t=Math.round((e.length-1)*Math.random());return e[t]},this["char"]="R",this.username="aleatório"}function a(e,t){return T=e,T.code?void(v.value=T.code):v.value=b}function o(e,t){var n=null,a=null;try{if(T.algorithm=new L(v.value),T.algorithm.username=T.username,T.algorithm["char"]="P",n=new _(T.algorithm,new r),a=n.run(),a.players=[{username:T.username},{username:"aleatório"}],"INVALID_MOVE"==a.reason)throw new Error("The Algorithm returned a invalid column: "+a.invalidMove+";");if(!t)return e(!1,a);w.innerHTML="",y.style.overflow="hidden",f.appendChild(k),x.load(a).play(function(){console.log("Ganhou: "+a.winner.username),console.log("Movimentos:",a.moves),console.log("Sequencia:",a.sequence),e(!1,a)},function(e){w.innerHTML+=["<li>","<b>",e.username,"</b> jogou na coluna <b>",e.move[0],"</b>;","</li>"].join(""),console.log(e)})}catch(o){throw e(!0,o),o}}function i(e){e.preventDefault(),d.innerHTML="Testando...",d.disabled=!0,o(function(e,t){return e?(d.innerHTML="Testar",d.disabled=!1,alert(t)):(d.innerHTML="Testar",void(d.disabled=!1))},!0)}function s(e){e.preventDefault(),w.innerHTML="",y.style.overflow="initial",f.removeChild(k),d.innerHTML="Testar",d.disabled=!1}function l(e){e.preventDefault(),v.value=b}function u(e){e.preventDefault(),d.disabled=!0,h.disabled=!0,h.innerHTML="Salvando...",o(function(e,t){return e?(d.disabled=!1,h.innerHTML="Salvar",h.disabled=!1,alert(t)):void M("/player/"+T.username).put({code:v.value},function(){h.innerHTML="Salvo c/ sucesso!",d.disabled=!1,setTimeout(function(){h.disabled=!1,h.innerHTML="Salvar"},2500)},!1)})}function c(){d=document.getElementById("test-algorithm-button"),m=document.createElement("button"),h=document.getElementById("submit-algorithm-button"),p=document.getElementById("reset-algorithm-button"),f=document.getElementById("playground-editor"),y=document.getElementById("playground"),v=document.getElementById("playground-textarea"),g=document.getElementById("playground-runner"),k=document.createElement("div"),w=document.createElement("ul"),E=document.createElement("div"),k.className="playground-test-board",w.className="playground-test-logs",E.className="game-board",m.className="button playground__close-test-button",m.innerHTML="Fechar",new A({textarea:v}),b=["'use strict';\n\n","/*\n"," * Classe Algorithm encapsula \n"," * a lógica para movimentação. \n"," * A instância da classe persiste \n"," * persiste durante todo o 'game'. \n"," */ \n\n","function Algorithm () {\n\n","    /*\n","     * Cada chamada de 'move' \n","     * corresponde a uma peça jogada. \n","     * Esse método recebe \n","     * as colunas disponíveis \n","     * do tabuleiro e o estado atual \n","     * do mesmo. \n\n","     * A variável availableColumns é \n","     * é disponíveis um Array com as\n","     * colunas para você colocar. \n","     * uma peça. Você DEVE escolher\n","     * um dos elementos desse Array.\n\n","     * A variável currentBoard \n","     * é uma cópia da matriz do jogo.  \n","     * Você PODE utilizar esse valor \n","     * para definir suas estratégias.\n","     */\n\n","    this.move = function (availableColumns, currentBoard) {\n\n","        /*\n","         * O retorno do método consiste\n","         * no índice da coluna onde \n","         * a peça deverá ser jogada. \n","         * Este indice deverá estar \n","         * entre as colunas disponíveis. \n","         * O RETORNO dessa função deve ser\n","         * um INTEIRO que pertence a\n","         * availableColumns.\n","         */\n\n","        return availableColumns[0];\n","    }","\n}\n"].join(""),E.setAttribute("data-interval",.5),E.setAttribute("data-rows",6),E.setAttribute("data-columns",7),E.setAttribute("data-players",!0),x=new N(E),E.appendChild(w),E.appendChild(m),k.appendChild(E),d.addEventListener("click",i),h.addEventListener("click",u),p.addEventListener("click",l),m.addEventListener("click",s),M("/player/"+v.getAttribute("data-username")).get(a)}var d,h,p,m,f,v,g,b,y,E,x,k,w,T,M=n(3),A=n(4),L=n(2),_=n(6),N=n(1);document.addEventListener("DOMContentLoaded",c)},function(e,t){"use strict";function n(e){var t=this.container=e,n=this.options={},r=this.board={},a=this.board.players={},o=this;t.className+=" game-board",n.rows=Number(e.getAttribute("data-rows"))||6,n.columns=Number(e.getAttribute("data-columns"))||7,n.interval=1e3*Number(e.getAttribute("data-interval"))||1e3,n.players=Boolean(e.getAttribute("data-score"))||!0,n.players&&(a.element=document.createElement("div"),a.element.className="game-board__players",a.guestElement=document.createElement("div"),a.guestName=document.createElement("span"),a.homeElement=document.createElement("div"),a.homeName=document.createElement("span"),a.guestElement.className="game-board__guest-player",a.homeElement.className="game-board__home-player",a.homeName.className="game-board__player-name",a.guestName.className="game-board__player-name",a.homeElement.appendChild(a.homeName),a.guestElement.appendChild(a.guestName),a.element.appendChild(a.homeElement),a.element.appendChild(a.guestElement),t.appendChild(a.element)),r.size=n.rows*n.columns,r.element=document.createElement("ul"),r.element.className="game-board__positions",r.positions=[];for(var i=0;i<r.size;i++)r.positions[i]=document.createElement("li"),r.positions[i].className="game-board__position",r.element.appendChild(r.positions[i]);return t.appendChild(r.element),{board:o.board,options:o.options,load:o.load.bind(o),play:o.play.bind(o)}}n.prototype.load=function(e){var t=this.board.positions,n=this.container,r=this.board.players;this.homePlayer=e.players[0],this.guestPlayer=e.players[1],this.move=0,this.moves=e.moves,this.sequence=e.sequence,r.homeName.innerHTML=this.homePlayer.username,r.guestName.innerHTML=this.guestPlayer.username,n.className=n.className.replace("game-board--finished","");for(var a=t.length-1;a>=0;a--)t[a].className="game-board__position";return this},n.prototype.play=function(e,t){var n=this.moves[this.move],r=n.username===this.homePlayer.username?"home-play":"guest-play",a=n.move[0],o=n.move[1];return this.timer&&clearTimeout(this.timer),t&&(this.onMove=t),e&&(this.onFinish=e),this.applyPosition(r,a,o),this.move++,this.onMove&&this.onMove(n),this.moves[this.move]?this.timer=setTimeout(this.play.bind(this),this.options.interval):(this.highlightSequence(this.sequence||[]),this.container.className+=" game-board--finished",void(this.onFinish&&this.onFinish(this)))},n.prototype.highlightSequence=function(e){var t=this.board.positions;for(var n in e){for(var r=0,a=e[n],o=-1;o<a[1];o++)r+=this.options.columns;r-=this.options.columns-a[0],t[r].className+=" game-board__position--sequence"}},n.prototype.applyPosition=function(e,t,n){for(var r=this.board.positions,a=0,o=(r.length,"game-board__position "+e),i=-1;n>i;i++)a+=this.options.columns;a-=this.options.columns-t,r[a].className=o},e.exports=n},function(e,t){"use strict";function n(e){if(-1==e.indexOf("function")||-1==e.indexOf("Algorithm"))throw new Error("You need to have a 'Algorithm' function;");if(this.constructor=new Function("window",e+" ;return Algorithm;")({}),!this.constructor||"function"!=typeof this.constructor)throw new Error("Invalid return statement;");if(this.instance=new this.constructor,!this.instance.move||"function"!=typeof this.instance.move)throw new Error("The Algorithm need to have a move method to make the plays;");if("number"!=typeof this.instance.move(r,a))throw new Error("The Algorithm move method should return a number;");return new this.constructor}var r=[0,1,2,3,4,5,6],a=[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]];e.exports=n},function(e,t){function n(e){var t=new XMLHttpRequest;return{get:function(n){t.open("GET",r+e),t.setRequestHeader("Content-Type","application/json; charset=UTF-8"),t.addEventListener("load",function(){var e=null;t.response&&(e=JSON.parse(t.response).payload),n(e,t.status)}),t.send()},put:function(n,a){t.open("PUT",r+e),t.setRequestHeader("Content-Type","application/json; charset=UTF-8"),t.addEventListener("load",function(){var e=null;t.response&&(e=JSON.parse(t.response).payload),a(e,t.status)}),t.send(JSON.stringify(n))}}}var r="//"+document.location.host+"/api";e.exports=n},function(e,t,n){var r,a,o=o||function(){var e={};return{add:function(t,n){if("object"==typeof t){var r;for(r=0;r<t.length;r++){var a=t[r];e[a]||(e[a]=[]),e[a].push(n)}}else e[t]||(e[t]=[]),e[t].push(n)},get:function(t){return e[t]?e[t]:void 0}}}(),i=i||function(e){"function"!=typeof String.prototype.repeat&&(String.prototype.repeat=function(e){if(1>e)return"";if(e%2)return this.repeat(e-1)+this;var t=this.repeat(e/2);return t+t}),"function"!=typeof Array.prototype.filter&&(Array.prototype.filter=function(e){if(null===this)throw new TypeError;var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var r=[],a=arguments[1],o=0;n>o;o++)if(o in t){var i=t[o];e.call(a,i,o,t)&&r.push(i)}return r});var t,n,r={textarea:null,replaceTab:!0,softTabs:!0,tabSize:4,autoOpen:!0,overwrite:!0,autoStrip:!0,autoIndent:!0,fence:!1},a={keyMap:[{open:'"',close:'"',canBreak:!1},{open:"'",close:"'",canBreak:!1},{open:"(",close:")",canBreak:!1},{open:"[",close:"]",canBreak:!0},{open:"{",close:"}",canBreak:!0}]},i={_callHook:function(e,t){var n=o.get(e);if(t="boolean"==typeof t&&t===!1?!1:!0,n)if(t){var a,s=r.textarea,l=s.value,u=i.cursor.get();for(a=0;a<n.length;a++)n[a].call(void 0,{editor:{element:s,text:l,levelsDeep:i.levelsDeep()},caret:{pos:u},lines:{current:i.cursor.getLine(l,u),total:i.editor.getLines(l)}})}else for(a=0;a<n.length;a++)n[a].call(void 0)},defineNewLine:function(){var e=document.createElement("textarea");e.value="\n",n=2==e.value.length?"\r\n":"\n"},defineTabSize:function(e){return"undefined"!=typeof r.textarea.style.OTabSize?void(r.textarea.style.OTabSize=e):"undefined"!=typeof r.textarea.style.MozTabSize?void(r.textarea.style.MozTabSize=e):"undefined"!=typeof r.textarea.style.tabSize?void(r.textarea.style.tabSize=e):void 0},cursor:{getLine:function(e,t){return e.substring(0,t).split("\n").length},get:function(){if("number"==typeof document.createElement("textarea").selectionStart)return r.textarea.selectionStart;if(document.selection){var e=0,t=r.textarea.createTextRange(),n=document.selection.createRange().duplicate(),a=n.getBookmark();for(t.moveToBookmark(a);0!==t.moveStart("character",-1);)e++;return e}},set:function(e,t){if(t||(t=e),r.textarea.setSelectionRange)r.textarea.focus(),r.textarea.setSelectionRange(e,t);else if(r.textarea.createTextRange){var n=r.textarea.createTextRange();n.collapse(!0),n.moveEnd("character",t),n.moveStart("character",e),n.select()}},selection:function(){var e,t,a,o,s,l=r.textarea,u=0,c=0;return"number"==typeof l.selectionStart&&"number"==typeof l.selectionEnd?(u=l.selectionStart,c=l.selectionEnd):(t=document.selection.createRange(),t&&t.parentElement()==l&&(e=i.editor.get(),o=e.length,a=l.createTextRange(),a.moveToBookmark(t.getBookmark()),s=l.createTextRange(),s.collapse(!1),a.compareEndPoints("StartToEnd",s)>-1?u=c=o:(u=-a.moveStart("character",-o),u+=e.slice(0,u).split(n).length-1,a.compareEndPoints("EndToEnd",s)>-1?c=o:(c=-a.moveEnd("character",-o),c+=e.slice(0,c).split(n).length-1)))),u==c?!1:{start:u,end:c}}},editor:{getLines:function(e){return e.split("\n").length},get:function(){return r.textarea.value.replace(/\r/g,"")},set:function(e){r.textarea.value=e}},fenceRange:function(){if("string"==typeof r.fence){for(var e=i.editor.get(),t=i.cursor.get(),n=0,a=e.indexOf(r.fence),o=0;a>=0&&(o++,!(a+n>t));)n+=a+r.fence.length,e=e.substring(a+r.fence.length),a=e.indexOf(r.fence);return t>n&&a+n>t&&o%2===0?!0:!1}return!0},isEven:function(e,t){return t%2},levelsDeep:function(){var e,t,n=i.cursor.get(),r=i.editor.get(),o=r.substring(0,n),s=0;for(e=0;e<o.length;e++)for(t=0;t<a.keyMap.length;t++)a.keyMap[t].canBreak&&(a.keyMap[t].open==o.charAt(e)&&s++,a.keyMap[t].close==o.charAt(e)&&s--);var l=0,u=["'",'"'];for(e=0;e<a.keyMap.length;e++)if(a.keyMap[e].canBreak)for(t in u)l+=o.split(u[t]).filter(i.isEven).join("").split(a.keyMap[e].open).length-1;var c=s-l;return c>=0?c:0},deepExtend:function(e,t){for(var n in t)t[n]&&t[n].constructor&&t[n].constructor===Object?(e[n]=e[n]||{},i.deepExtend(e[n],t[n])):e[n]=t[n];return e},addEvent:function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},removeEvent:function(e,t,n){e.addEventListener?e.removeEventListener(t,n,!1):e.attachEvent&&e.detachEvent("on"+t,n)},preventDefaultEvent:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1}},s={tabKey:function(e){if(i.fenceRange()){if(9==e.keyCode){i.preventDefaultEvent(e);var n=!0;i._callHook("tab:before");var r=i.cursor.selection(),a=i.cursor.get(),o=i.editor.get();if(r){for(var s=r.start;s--;)if("\n"==o.charAt(s)){r.start=s+1;break}var l,u=o.substring(r.start,r.end),c=u.split("\n");if(e.shiftKey){for(l=0;l<c.length;l++)c[l].substring(0,t.length)==t&&(c[l]=c[l].substring(t.length));u=c.join("\n"),i.editor.set(o.substring(0,r.start)+u+o.substring(r.end)),i.cursor.set(r.start,r.start+u.length)}else{for(l in c)c[l]=t+c[l];u=c.join("\n"),i.editor.set(o.substring(0,r.start)+u+o.substring(r.end)),i.cursor.set(r.start,r.start+u.length)}}else{var d=o.substring(0,a),h=o.substring(a),p=d+t+h;e.shiftKey?o.substring(a-t.length,a)==t&&(p=o.substring(0,a-t.length)+h,i.editor.set(p),i.cursor.set(a-t.length)):(i.editor.set(p),i.cursor.set(a+t.length),n=!1)}i._callHook("tab:after")}return n}},enterKey:function(e){if(i.fenceRange()&&13==e.keyCode){i.preventDefaultEvent(e),i._callHook("enter:before");var r,o,s=i.cursor.get(),l=i.editor.get(),u=l.substring(0,s),c=l.substring(s),d=u.charAt(u.length-1),h=c.charAt(0),p=i.levelsDeep(),m="",f="";if(p){for(;p--;)m+=t;for(m=m,r=m.length+1,o=0;o<a.keyMap.length;o++)a.keyMap[o].open==d&&a.keyMap[o].close==h&&(f=n)}else r=1;var v=u+n+m+f+m.substring(0,m.length-t.length)+c;i.editor.set(v),i.cursor.set(s+r),i._callHook("enter:after")}},deleteKey:function(e){if(i.fenceRange()&&8==e.keyCode){i.preventDefaultEvent(e),i._callHook("delete:before");var t,n=i.cursor.get(),r=i.editor.get(),o=r.substring(0,n),s=r.substring(n),l=o.charAt(o.length-1),u=s.charAt(0);if(i.cursor.selection()===!1){for(t=0;t<a.keyMap.length;t++)if(a.keyMap[t].open==l&&a.keyMap[t].close==u){var c=r.substring(0,n-1)+r.substring(n+1);return i.editor.set(c),void i.cursor.set(n-1)}var c=r.substring(0,n-1)+r.substring(n);i.editor.set(c),i.cursor.set(n-1)}else{var d=i.cursor.selection(),c=r.substring(0,d.start)+r.substring(d.end);i.editor.set(c),i.cursor.set(n)}i._callHook("delete:after")}}},l={openedChar:function(e,t){i.preventDefaultEvent(t),i._callHook("openChar:before");var n=i.cursor.get(),a=i.editor.get(),o=a.substring(0,n),s=a.substring(n),l=o+e.open+e.close+s;r.textarea.value=l,i.cursor.set(n+1),i._callHook("openChar:after")},closedChar:function(e,t){var n=i.cursor.get(),r=i.editor.get(),a=r.substring(n,n+1);return a==e.close?(i.preventDefaultEvent(t),i._callHook("closeChar:before"),i.cursor.set(i.cursor.get()+1),i._callHook("closeChar:after"),!0):!1}},u={filter:function(e){if(i.fenceRange()){var t=e.which||e.keyCode;if(39!=t&&(40!=t||0!==e.which)){var n,o=String.fromCharCode(t);for(n=0;n<a.keyMap.length;n++)if(a.keyMap[n].close==o){var s=r.overwrite&&l.closedChar(a.keyMap[n],e);!s&&a.keyMap[n].open==o&&r.autoOpen&&l.openedChar(a.keyMap[n],e)}else a.keyMap[n].open==o&&r.autoOpen&&l.openedChar(a.keyMap[n],e)}}},listen:function(){r.replaceTab&&i.addEvent(r.textarea,"keydown",s.tabKey),r.autoIndent&&i.addEvent(r.textarea,"keydown",s.enterKey),r.autoStrip&&i.addEvent(r.textarea,"keydown",s.deleteKey),i.addEvent(r.textarea,"keypress",u.filter),i.addEvent(r.textarea,"keydown",function(){i._callHook("keydown")}),i.addEvent(r.textarea,"keyup",function(){i._callHook("keyup")})}},c=function(e){e.textarea&&(i._callHook("init:before",!1),i.deepExtend(r,e),i.defineNewLine(),r.softTabs?t=" ".repeat(r.tabSize):(t="	",i.defineTabSize(r.tabSize)),u.listen(),i._callHook("init:after",!1))};this.destroy=function(){i.removeEvent(r.textarea,"keydown",s.tabKey),i.removeEvent(r.textarea,"keydown",s.enterKey),i.removeEvent(r.textarea,"keydown",s.deleteKey),i.removeEvent(r.textarea,"keypress",u.filter)},c(e)};"undefined"!=typeof e&&e.exports&&(e.exports=i),"undefined"==typeof ender&&(this.Behave=i,this.BehaveHooks=o),r=[],a=function(){return i}.apply(t,r),!(void 0!==a&&(e.exports=a))},function(e,t,n){(function(t){function n(){this.width=7,this.height=6,this.maxMoves=this.width*this.height,this.matrix=this.buildMatrix()}n.prototype.push=function(e,t){var n=this.matrix[t].lastIndexOf(null);return 0>n?!1:(this.matrix[t][n]=e["char"],[t,n])},n.prototype.cloneBoard=function(){var e=[];for(var t in this.matrix)e.push(this.matrix[t].slice(0));return e},n.prototype.buildMatrix=function(){for(var e=[],t=0;t<this.width;t++){e[t]=[];for(var n=0;n<this.height;n++)e[t][n]=null}return e},n.prototype.getAvailableColumns=function(){var e=[];for(var t in this.matrix)this.matrix[t].lastIndexOf(null)>=0&&e.push(parseInt(t));return e},n.prototype.draw=function(){for(var e=0;e<this.height;e++){for(var n=0;n<this.width;n++){var r=this.matrix[n][e]||" ";t.stdout.write("| "+r+" ")}t.stdout.write("\n")}},e.exports=n}).call(t,n(7))},function(e,t,n){"use strict";function r(e,t){this.board=new a,this.players=[e,t]}var a=n(5);r.status={INVALID_MOVE:"INVALID_MOVE",LIG4:"LIG4",DRAW:"DRAW"},r.prototype.run=function(){for(var e={winner:null,reason:null,moves:[],sequence:[]},t=0;t<this.board.maxMoves;t++){var n=this.players[t%2],a=this.board.getAvailableColumns(),o=this.board.cloneBoard(),i=n.move(a,o);if(a.indexOf(i)<0){e.winner=this.players[(t+1)%2],e.reason=r.status.INVALID_MOVE,e.invalidMove=i;break}var s=this.board.push(n,i);e.moves.push({username:n.username,move:s});var l=this.matchAnalyzer();if(l){e.winner=n,e.reason=r.status.LIG4,e.sequence=l;break}}return e.winner||(e.reason=r.status.DRAW),e},r.prototype.matchAnalyzer=function(){for(var e=null,t=0;t<this.board.width;t++){var n=this.board.matrix[t];if(e)break;for(var r=0;r<this.board.height;r++){var a=n[r];if(null!=a){if(n[r+1]==a&&n[r+2]==a&&n[r+3]==a){e=[[t,r],[t,r+1],[t,r+2],[t,r+3]];break}if(this.board.matrix[t]&&this.board.matrix[t+3]&&this.board.matrix[t+1][r]==a&&this.board.matrix[t+2][r]==a&&this.board.matrix[t+3][r]==a){e=[[t,r],[t+1,r],[t+2,r],[t+3,r]];break}if(this.board.matrix[t]&&this.board.matrix[t+3]&&this.board.matrix[t+1][r+1]==a&&this.board.matrix[t+2][r+2]==a&&this.board.matrix[t+3][r+3]==a){e=[[t,r],[t+1,r+1],[t+2,r+2],[t+3,r+3]];break}if(this.board.matrix[t]&&this.board.matrix[t+3]&&this.board.matrix[t+1][r-1]==a&&this.board.matrix[t+2][r-2]==a&&this.board.matrix[t+3][r-3]==a){e=[[t,r],[t+1,r-1],[t+2,r-2],[t+3,r-3]];break}}}}return e},e.exports=r},function(e,t){function n(){u=!1,i.length?l=i.concat(l):c=-1,l.length&&r()}function r(){if(!u){var e=setTimeout(n);u=!0;for(var t=l.length;t;){for(i=l,l=[];++c<t;)i[c].run();c=-1,t=l.length}i=null,u=!1,clearTimeout(e)}}function a(e,t){this.fun=e,this.array=t}function o(){}var i,s=e.exports={},l=[],u=!1,c=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new a(e,t)),1!==l.length||u||setTimeout(r,0)},a.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}}]);