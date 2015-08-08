var assert = require('assert'),
    Game = require('../game'),
    DummyPlayer = require('../players/dummy'),
    SequentialPlayer = require('../players/sequential');

describe('Game', function() {
  it('it runs', function () {
    var game  = new Game(DummyPlayer, DummyPlayer);
    assert(game.run());

    var game  = new Game(DummyPlayer, SequentialPlayer);
    assert(game.run());
  });
});
