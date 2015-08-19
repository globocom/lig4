'use strict';

var GameBoard = require('../../scripts/components/gameboard');

var testGame;
var testGameElement;
var gameboardElement;
var playersElement;
var guestElement;
var homeElement;
var homeNameElement;
var homeInfoElement;
var guestNameElement;
var guestInfoElement;
var positionsElement;

var testGameOptions = {
  interval: .1,
  rows: 6,
  columns: 7,
  players: true,
};

var testGameMatch = {
  players: [{
    name: 'jonathanprates',
    position: 2,
    score: 110,
  }, {
    name: 'lucastephanou',
    position: 3,
    score: 100,
  }],
  moves: [
    [0, 0, 5], [1, 1, 5], [0, 2, 5], [1, 3, 5], [0, 4, 5], [1, 5, 5],
    [0, 6, 5], [0, 0, 4], [1, 1, 4], [1, 2, 4], [1, 3, 4], [1, 4, 4],
  ],
  sequence: [
      [1, 4], [2, 4], [3, 4], [4, 4]
  ]
};

describe('GameBoard', function () {
  beforeEach(function () {
    testGameElement = document.createElement('div');
    testGameElement.setAttribute('data-interval', testGameOptions.interval);
    testGameElement.setAttribute('data-rows', testGameOptions.rows);
    testGameElement.setAttribute('data-columns', testGameOptions.columns);
    testGameElement.setAttribute('data-players', testGameOptions.players);
    document.body.appendChild(testGameElement);

    testGame = new GameBoard(testGameElement);

    gameboardElement = document.getElementsByClassName('game-board')[0];
    playersElement = gameboardElement.getElementsByClassName('game-board__players')[0];
    guestElement = playersElement.getElementsByClassName('game-board__guest-player')[0];
    homeElement = playersElement.getElementsByClassName('game-board__home-player')[0];
    homeNameElement = homeElement.getElementsByClassName('game-board__player-name')[0];
    homeInfoElement = homeElement.getElementsByClassName('game-board__player-info')[0];
    guestNameElement = guestElement.getElementsByClassName('game-board__player-name')[0];
    guestInfoElement = guestElement.getElementsByClassName('game-board__player-info')[0];
    positionsElement = gameboardElement.getElementsByClassName('game-board__positions')[0];
  });

  afterEach(function () {
    document.body.removeChild(testGameElement);
  });

  // tests

  it('should initiate the gameboard', function () {
    expect(testGame).toBeDefined();
    expect(testGame.options).toBeDefined();
    expect(testGame.board).toBeDefined();
    expect(testGame.load).toBeDefined();
    expect(testGame.play).toBeDefined();
  });

  it('should set its options like its data-attributes', function () {
    expect(testGame.options.interval).toEqual(testGameOptions.interval * 1000);
    expect(testGame.options.rows).toEqual(testGameOptions.rows);
    expect(testGame.options.columns).toEqual(testGameOptions.columns);
    expect(testGame.options.players).toEqual(testGameOptions.players);
  });

  it('should create the interface correctly', function () {
    expect(gameboardElement).toBeTruthy();
    expect(playersElement).toBeTruthy();
    expect(guestElement).toBeTruthy();
    expect(homeElement).toBeTruthy();
    expect(homeNameElement).toBeTruthy();
    expect(homeInfoElement).toBeTruthy();
    expect(guestNameElement).toBeTruthy();
    expect(guestInfoElement).toBeTruthy();
    expect(positionsElement).toBeTruthy();
  });

  it('should create the positions correctly', function () {
    var positions = testGameElement.getElementsByClassName('game-board__position');

    expect(positions.length).toBe(testGameOptions.rows * testGameOptions.columns);
  });

  it('should load game players correctly', function () {
    var homePlayer = testGameMatch.players[0];
    var guestPlayer = testGameMatch.players[1];

    testGame.load(testGameMatch);

    expect(homeNameElement.innerHTML).toBe([homePlayer.name].join(''));
    expect(guestNameElement.innerHTML).toBe([guestPlayer.name].join(''));

    expect(homeInfoElement.innerHTML).toBe([homePlayer.score, ' pontos'].join(''));
    expect(guestInfoElement.innerHTML).toBe([guestPlayer.score, ' pontos'].join(''));
  });

  it('should play all game moves', function (done) {
    testGame.options.interval = 0;

    testGame.load(testGameMatch).play(function(gameboard) {
      var homePlays = positionsElement.getElementsByClassName('home-play');
      var guestPlays = positionsElement.getElementsByClassName('guest-play');

      expect(homePlays.length + guestPlays.length).toEqual(testGameMatch.moves.length);

      done();
    });

  }, 0);

  it('should have a sequence of four', function (done) {
    testGame.options.interval = 0;

    testGame.load(testGameMatch).play(function(gameboard) {
      var sequencePlays = positionsElement.getElementsByClassName('game-board__position--sequence');

      expect(sequencePlays.length).toEqual(4);

      done();
    });

  }, 0);

  it('should reset the board after load a new match', function (done) {
    testGame.options.interval = 0;

    testGame.load(testGameMatch).play(function(gameboard) {
      testGame.load(testGameMatch);

      var homePlays = positionsElement.getElementsByClassName('home-play');
      var guestPlays = positionsElement.getElementsByClassName('guest-play');
      var sequencePlays = positionsElement.getElementsByClassName('game-board__position--sequence');

      expect(gameboardElement.className.indexOf('game-board--finished')).toEqual(-1);
      expect(homePlays.length + guestPlays.length + sequencePlays.length).toEqual(0);

      done();
    });

  }, 0);
});
