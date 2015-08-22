'use strict'

var vm = require('vm');
var Match = require('./engine/match');

function onFinish(result) {
  console.log('Match result: ', result.scores)
  try {
    process.send(result);
	}catch(e){
	  console.log('error sending result to parent process: ', result)
	}
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
      try {
        vm.runInContext(player.code, local, options);
      } catch (e) {
        console.log('code  with error for player: ', player.username)
      }

      if (local.Algorithm === undefined && local.Player === undefined) {
        // TODO: player lose in this scenario
        console.log('Invalid code for player: ', player.username)
        process.exit()
      }

      players[player.username] = local.Algorithm || local.Player;
    };

    var engine = new Match();
    for (var username in players) {
      engine.addPlayer({
        username: username,
        klass: players[username]
      });
    }
    engine.run();
    var result = engine.getResults();
    result.id = match._id;

    onFinish(result);

  })(process, module, require);
});
