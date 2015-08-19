var assert = require('assert'),
    Game = require('../game'),
    DummyPlayer = require('../players/dummy'),
    SequentialPlayer = require('../players/sequential');

describe('Game', function() {
  it('it runs', function () {
    var game  = new Game(new DummyPlayer, new DummyPlayer);
    assert(game.run());

    var game  = new Game(new DummyPlayer, new SequentialPlayer);
    assert(game.run());
  });
});
