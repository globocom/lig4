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
    var players = {};
   
    vm.createContext(gameContext);

    for (var player of match.players) {
      var local = {};
      vm.createContext(local);
      vm.runInContext(player.code, local, options);

      if (local.Algorithm === undefined && local.Player === undefined) {
        console.log('Invalid code for player: ', player.username)
        process.exit()
      }

      players[player.username] = local.Algorithm || local.Player;
      id = match._id;
    };

    vm.createContext(gameContext);

    var engine = new Match();                
    for (var username in players) {          
        engine.addPlayer({username: username, klass: players[username]});                 
    }                                        
    engine.run();                            
    var result = engine.getResults();        

    vm.runInContext(code, gameContext, options);
    onFinish(gameContext);

  })(process, module, require);
});
