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

function Algorithm (source) {
  try {
    this.constructor = (new Function('window', 'document', source + ' ;return Algorithm;')).call({}, {}, {});
    this.instance = new this.constructor();
  } catch (error) {
    throw new Error('You need to have a \'Algorithm\' function;');
  }

  try {
    var move = this.instance.move(availableColumnsMock, availableBoardMock);

    if (typeof move !== 'number') throw new Error();
  } catch (error) {
    throw new Error('The Algorithm need to have a move method and it should return a number;');
  }

  return new this.constructor();
}

module.exports = Algorithm;
