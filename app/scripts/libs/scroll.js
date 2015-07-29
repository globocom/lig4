'use strict';

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (fn) {
      window.setTimeout(fn, 15);
    };

function easeInOutCubic (position) {
  if (position < 0.5) {
    return 4 * position * position * position;
  }

  return (position-1) * (2 * position - 2) * (2 * position - 2) + 1;
}

function calculatePosition (position, endPosition, elapsed, duration) {
  if (elapsed > duration) {
    return endPosition;
  }

  return position + (endPosition - position) * easeInOutCubic(elapsed / duration);
}

function topPosition (element) {
  if (element.nodeName === 'HTML') {
    return 0;
  }

  return element.getBoundingClientRect().top + window.pageYOffset;
}

module.exports = function scroll (element) {
  var position = window.pageYOffset;
  var endPosition = topPosition(element);
  var timer = Date.now();
  var duration = 500;

  function movePosition () {
    var elapsed = Date.now() - timer;
    var nextPosition = calculatePosition(position, endPosition, elapsed, duration);

    window.scroll(0, nextPosition);

    if (elapsed < duration) {
      requestAnimationFrame(movePosition);
    }
  }

  movePosition();
};
