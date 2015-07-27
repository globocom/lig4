'use strict'
//var Match = require('./../api/models/match')

var mongoose = require('mongoose')
var Player = require('./../api/models/player')

  //var Leaderboard = require('./../api/models/leaderboard')

var main = function () {

  var p = new Player({
    "username": "jonathans2222",
    "github": "dww25",
    "email": "dummy@dummies.net",
    "registration": 1234,
    "code": "console.log()"
  })

  Player.find(function(err, p) {
    console.log(err, p)
  })

  mongoose.connection.on('error', function() {
      console.log()
  });


  // p.save(function (error) {
  //   console.log(error)
  //   mongoose.disconnect()
  // })





  // carrega todos os players na memoria
  // define uma "rodada" para atribuir a propriedade round
  // cria no mnogo N x N partidas para esse round
  // Marca o flag como delivered = false
  // para cada partida criada, chama o game e da um update nos results da colection match.
  // varre os registros para atualizar o leaderboard

}
mongoose.connect('mongodb://webgo:webgo@ds053312.mongolab.com:53312/webgo', function (error) {
  main()

})




/*



players.forEach(function (opponent) {
  var match = new Match()
  match.home = player
  match.guest = opponent
  match.save(function (err) {
    // OK!
  })
})
onEnd(player)


var setupPlayer = function (data, onEnd) {



    // Insert into leaderboard
    var leaderboard = new Leaderboard()
    leaderboard.player = player
    leaderboard.score = 0
    leaderboard.save()

    // Create matches
    Player
      .find()
      .where('username')
      .ne(player.username) // each other
      .exec(function (err, players) {

        players.forEach(function (opponent) {
          var match = new Match()
          match.home = player
          match.guest = opponent
          match.save(function (err) {
            // OK!
          })
        })
        onEnd(player)
      })
  })
}

*/
