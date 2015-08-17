'use strict';

var cp = require('child_process');

var AsyncPool = function (timeout) {
  this.children = 0;
  this.finilized = false;
  this.events = {
    exit: function () {},
    message: function () {}
  };
  this.timeout = timeout || 2000;
};

AsyncPool.prototype.add = function (file, message) {
  var pm = this;
  var child = cp.fork(file);

  setTimeout(function () {
    child.kill()
  }, this.timeout)

  child.send(message);

  pm.children++;
  child.on('close', function () {
    pm.children--;

    setTimeout(function () {
      if (!pm.finilized && pm.children === 0) {
        pm.finilized = true;
        pm.events['finish']();
      }
    }, 1000)
  });

  child.on('message', function (msg) {
    return pm.events['message'](msg);
  });
};

AsyncPool.prototype.on = function (event, fnc) {
  this.events[event] = fnc;
};

module.exports = AsyncPool;
