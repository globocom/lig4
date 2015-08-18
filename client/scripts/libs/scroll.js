'use strict';

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (fn) {
      window.setTimeout(fn, 15);
    };

function easeInOutCubic (position) {
  if (position < 0.5) return 4 * position * position * position;

  return (position - 1) * (2 * position - 2) * (2 * position - 2) + 1;
}

function calculatePosition (position, endPosition, elapsed, duration) {
  if (elapsed > duration) return endPosition;

  return position + (endPosition - position) * easeInOutCubic(elapsed / duration);
}

function topPosition (element) {
  return element.getBoundingClientRect().top + window.pageYOffset;
}

function scroll (element, duration) {
  var position = (window.pageYOffset || document.body.scrollTop) - (document.body.clientTop || 0);
  var endPosition = topPosition(element);
  var timer = Date.now();

  if (duration === undefined || duration === 0) return window.scrollTo(0, endPosition);

  function movePosition () {
    var elapsed = Date.now() - timer;
    var nextPosition = calculatePosition(position, endPosition, elapsed, duration);

    window.scrollTo(0, nextPosition);

    if (elapsed < duration) {
      requestAnimationFrame(movePosition);
    }
  }

  movePosition();
};

module.exports = scroll;
