var assert = require('assert'),
    Board = require('../board');

describe('Board', function() {
  describe('initialize', function () {
    before(function(){
      this.board = new Board();
    })
    it('with a width of 7', function(){
      assert.equal(this.board.width, 7);
    });

    it('with a height of 6', function(){
      assert.equal(this.board.height, 6);
    });

    it('with maxMoves of 42', function(){
      assert.equal(this.board.maxMoves, 42);
    });
  });

  describe('push', function(){
    beforeEach(function(){
      this.board = new Board();
    })
    it('add a piece to the board', function(){
      var player = { 'char': 'x'}
      this.board.push(player, 0)
      this.board.draw();
      assert.equal(this.board.matrix[0][5], 'x');
    });
  });

  describe('build matrix', function(){

  });
});
