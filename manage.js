'use strict';

process.env.DBAAS_MONGODB_ENDPOINT = require('./config/dev.json').apps[0].env.DBAAS_MONGODB_ENDPOINT;


var slugify = require('slugify');
var optimist = require('optimist');

var Player = require('./models/player');
var Tournament = require('./models/tournament');


function addUser() {
  var user = 'fake_user_' + Math.floor((Math.random() * 999) + 100);
  var code = [
        'function Algorithm () { ',
        '    this.move = function (availableColumns, gameBoard) { ',
        '       return availableColumns[0];',
        '    }',
        '}'].join('');

  Player({
      username: user,
      github: 'https://dummy.uri/' + user,
      email: user + '@mail.me',
      code: code
    })
    .save(function (err, player) {
      console.log(user + ' created.');
      process.exit();
    });
}

function addTournament() {
  var name = 'Lig4 Championship ' + Math.floor((Math.random() * 999) + 100);

  // Set all as active = false.

  Tournament.update({ active: true }, { active: false }, { multi: true }, function (err) {

    // adds a new Tournament

    Tournament({
        name: name,
        active: true,
        slug: slugify(name).toLowerCase(),
        texts: {
          title: name
        }
      })
      .save(function (err, tournament) {
        console.log(tournament.name + ' created.');
        process.exit();
      });
  });
}

switch (optimist.argv.add) {

case 'user':
  addUser();
  break;
case 'tournament':
  addTournament();
  break
default:
  console.log('Inavlid option')
  process.exit();

}
