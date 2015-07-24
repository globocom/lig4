var Match = require('./../models/match')
var Leaderboard = require('./../models/leaderboard')

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
