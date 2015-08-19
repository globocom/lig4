'use strict';

function Algorithm (source) {
  this.constructor = (new Function('window', source))({});
}

Algorithm.prototype.validate = function() {
  var algorithm = null;

  if (!this.constructor || this.constructor.name !== 'Algorithm' || typeof this.constructor !== 'function') {
    throw new Error('You need to return a Algorithm function;');
  }

  algorithm = new this.constructor();

  if (!algorithm.move || typeof algorithm.move !== 'function') {
    throw new Error('The Algorithm need to have a move method to make the plays;');
  }

  if (typeof algorithm.move([0]) !== 'number') {
    throw new Error('The Algorithm move method should return a number;');
  }
};

module.exports = Algorithm;
