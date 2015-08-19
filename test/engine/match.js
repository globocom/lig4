var assert = require('assert'),
  Match = require('../../engine/match'),
  SequentialPlayer = require('../../engine/players/sequential');

describe('Match', function () {
  it('should return null after a draw', function () {
    var match = new Match;
    match.addPlayer(new SequentialPlayer("Player1"));
    match.addPlayer(new SequentialPlayer("Player2"));
    match.run();
    var matchResult = match.getResults();
    assert.equal(matchResult.winner, null);
  });
});
