var assert = require('assert'),
  Match = require('../../engine/match'),
  SequentialPlayer = require('../../engine/players/sequential');

describe('Match', function () {
  it('should return null after a draw', function () {
    var match = new Match;
    match.addPlayer({
        username: 'Player1',
        klass: SequentialPlayer
      });
    match.addPlayer({
      username: 'Player2',
      klass: SequentialPlayer
    });
    match.run();
    var matchResult = match.getResults();
    assert.equal(matchResult.winner, null);
  });
});
