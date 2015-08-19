'use strict'

var vm = require('vm');
var engine = require('./engine/match');

function onFinish (result) {
  process.send(result);
  process.exit();
}

process.on('message', function (match) {

  (function (process, module, require) {
    process = module = require = null;

    var options = { timeout: 5000 }
    var gameContext = { Match: engine, players: {}, result: {}, id: 0 }
    vm.createContext(gameContext);

    for (var player of match.players) {
      var local = {};
      vm.createContext(local);
      vm.runInContext(player.code, local, options);
      gameContext.players[player.username] = local.Player;
      gameContext.id = match._id;
    };

    // TODO: validate if p1 and p2 arent null or undefined.
    vm.createContext(gameContext);

    var code = "\
        var engine = new Match();                \
        for (var username in players) {          \
            var p = new players[username];       \
            p.username = username;               \
            engine.addPlayer(p);                 \
        }                                        \
        engine.run();                            \
        var result = engine.getResults();        "

    vm.runInContext(code, gameContext, options);
    onFinish(gameContext);

  })(process, module, require);
});
