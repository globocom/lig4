'use strict';

function waitForUpdates(updateCounts, callback) {

  // updateCounts must be an object to allow changing its attribute from outside.
  console.log('Waiting for updates... (' + updateCounts.done + ' of ' + updateCounts.total + ')');

  if (updateCounts.total == updateCounts.done) return callback();
  setTimeout(function () {
    waitForUpdates(updateCounts, callback);
  }, 2000);
}

module.exports = {
  'waitForUpdates': waitForUpdates
}
