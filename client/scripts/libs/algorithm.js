'use strict';

var availableColumnsMock = [0, 1, 2, 3, 4, 5, 6];
var availableBoardMock = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null]
];

function Algorithm(algorithmSource) {
  if (algorithmSource.indexOf('function') == -1 ||
    algorithmSource.indexOf('Algorithm') == -1) {
    throw new Error('You need to have a \'Algorithm\' function;');
  }

  this.constructor = (new Function('window', algorithmSource + ' ;return Algorithm;'))({});

  if (!this.constructor || typeof this.constructor !== 'function') {
    throw new Error('Invalid return statement;');
  }

  this.instance = new this.constructor();

  if (!this.instance.move || typeof this.instance.move !== 'function') {
    throw new Error('The Algorithm need to have a move method to make the plays;');
  }

  if (typeof this.instance.move(availableColumnsMock, availableBoardMock) !== 'number') {
    throw new Error('The Algorithm move method should return a number;');
  }

  return new this.constructor();
}

module.exports = Algorithm;
