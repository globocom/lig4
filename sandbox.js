'use strict'

var vm = require('vm');
var engine = require('./engine/match');

function onFinish(message) {
  console.log('Match result: ', message.result.scores)
  process.send(message);
  process.exit();
}

process.on('message', function (match) {

  (function (process, module, require) {

    var options = {
      timeout: 5000
    }
    var gameContext = {
      Match: engine,
      players: {},
      result: {},
      id: 0
    }
    vm.createContext(gameContext);

    for (var player of match.players) {
      var local = {};
      vm.createContext(local);
      vm.runInContext(player.code, local, options);

      if (local.Algorithm === undefined && local.Player === undefined) {
        console.log('Invalid code for player: ', player.username)
        process.exit()
      }

      gameContext.players[player.username] = local.Algorithm || local.Player;
      gameContext.id = match._id;
    };

    vm.createContext(gameContext);

    var code =
      "\
        'use strict';                            \
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
