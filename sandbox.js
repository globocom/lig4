'use strict'

var vm = require('vm');
var engine = require('./engine/game');

function onFinish (result) {
  var sequences = result.match.sequence;
  var logs = result.match.logs;
  for (var i = 0; i < logs.length; i++) {
    var boardPosition = logs[i];
    var boardCol = logs[i].move[0];
    var boardRow = logs[i].move[1];
    
    boardPosition.sequence = false;
    for (var j = 0; j < sequences.length; j++) {
      var sequencePosition = sequences[j];
      var sequenceCol = sequencePosition[0];
      var sequenceRow = sequencePosition[1];

      if (boardCol == sequenceCol && boardRow == sequenceRow) {
        boardPosition.sequence = true;
        break;
      }; 
    };
  };

  process.exit();
}

process.on('message', function (match) {

  (function (process, module, require) {
    process = module = require = null;

    var options = { timeout: 5000 }
    var gameContext = { Engine: engine, players: {}, result: {} }
    vm.createContext(gameContext);

    for (var player of match.players) {
      var local = {};
      vm.createContext(local);
      vm.runInContext(player.code, local, options);
      gameContext.players[player.username] = local.Player;
    };

    // TODO: validate if p1 and p2 arent null or undefined.
    vm.createContext(gameContext);

    var code = "\
        var engine = new Engine();               \
        for (var username in players) {          \
            var p = new players[username];       \
            p.username = username;               \
            engine.addPlayer(p);                 \
        }                                        \
        var match = engine.run();                "

    vm.runInContext(code, gameContext, options);
    onFinish(gameContext);

  })(process, module, require);
});
