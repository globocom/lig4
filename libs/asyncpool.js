'use strict';

var cp = require('child_process');

var AsyncPool = function (timeout, maxPoolSize) {
  this.queue = [];
  this.slots = [];
  this.wait = 2000;
  this.maxPoolSize = maxPoolSize || 10;
  this.events = {
    exit: function () {},
    message: function () {}
  };
  this.timeout = timeout || 10000;
  setTimeout(this.run.bind(this), this.wait);
};

AsyncPool.prototype.add = function (file, message) {
  // populate current queue.
  this.queue.push({
    file: file,
    message: message
  });
  console.log('Proc added: ', file)
}

AsyncPool.prototype.run = function (file, message) {
  while (this.slots.length <= this.maxPoolSize && this.queue.length > 0) {
    // add to buffer
    this.slots.push(this.queue.pop());
  }
  // for each proc in buffer, exec do() with its index.
  for (var index in this.slots) {
    this.do(index, this.slots[index]);
  }
  if (this.queue.length === 0 && this.slots.length === 0) {
    // no more procs, neither buffer nor queue.
    setTimeout(function () {
      this.events['finish']();
      process.exit();
    }.bind(this), this.wait);
  }
  // queue is not empty yet, call run again()
  setTimeout(this.run.bind(this), this.wait);
}

AsyncPool.prototype.do = function (index, proc) {
  var pm = this;
  var child = cp.fork(proc.file);

  console.log('Proc forked: ', proc.file, ' at slot ', index);

  // on timeout, kill child process.
  setTimeout(function () {
    child.kill()
  }, this.timeout)

  // fork and send message!
  child.send(proc.message);
  child.on('message', function (msg) {
    return pm.events['message'](msg);
  });

  // when child exits, remove it from slots at index N.
  child.on('close', function () {
    pm.slots.pop(index);
  });
};

AsyncPool.prototype.on = function (event, fnc) {
  this.events[event] = fnc;
};

module.exports = AsyncPool;