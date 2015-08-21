'use strict'

var vm = require('vm');
var Match = require('./engine/match');

function onFinish(result) {
  console.log('Match result: ', result.scores)
  process.send(result);
  process.exit();
}

process.on('message', function (match) {

  (function (process, module, require) {

    var options = {
      timeout: 5000
    }
    var players = {};

    for (var player of match.players) {
      var local = {};
      vm.createContext(local);
      vm.runInContext(player.code, local, options);

      if (local.Algorithm === undefined && local.Player === undefined) {
        // TODO: player lose in this scenario
        console.log('Invalid code for player: ', player.username)
        process.exit()
      }

      players[player.username] = local.Algorithm || local.Player;
    };

    var engine = new Match();
    for (var username in players) {
        engine.addPlayer({username: username, klass: players[username]});
    }
    engine.run();
    var result = engine.getResults();
    result.id = match._id;

    onFinish(result);

  })(process, module, require);
});
