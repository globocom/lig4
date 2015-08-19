'use strict';

function Algorithm (algorithmSource) {
  this.constructor = (new Function('window', algorithmSource + ' return Algorithm;'))({});

  if (!this.constructor || this.constructor.name !== 'Algorithm' || typeof this.constructor !== 'function') {
    throw new Error('You need to return a Algorithm function;');
  }

  this.instance = new this.constructor();

  if (!this.instance.move || typeof this.instance.move !== 'function') {
    throw new Error('The Algorithm need to have a move method to make the plays;');
  }

  if (typeof this.instance.move([0]) !== 'number') {
    throw new Error('The Algorithm move method should return a number;');
  }

  return new this.constructor();
}

module.exports = Algorithm;
