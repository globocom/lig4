'use strict';

var os = require('os');
var cp = require('child_process');

var ProcessHandler = function (file, message, events) {
  this.file = file;
  this.message = message;
  this.child = null;
  this.events = events;
  this.process_states = { READY: 'READY',
                          RUNNING: 'RUNNING',
                          FINISHED: 'FINISHED'
  };
  this.status = this.process_states.READY;

}

ProcessHandler.prototype.run = function () {
  var self = this;
  this.child = cp.fork(this.file);
  this.status = this.process_states.RUNNING;

  console.log('Proc forked: ', this.file);

  setTimeout(function () {
    if (self.isRunning()) {
      return;
    }
    self.child.kill();
    self.status = self.process_states.FINISHED;
  }, this.timeout)

  this.child.send(this.message);
  this.child.on('message', function (msg) {
    return self.events['message'](msg);
  });

  this.child.on('close', function () {
    self.status = self.process_states.FINISHED;
  });
}

ProcessHandler.prototype.isReady = function () {
  return this.status === this.process_states.READY;
}

ProcessHandler.prototype.isRunning = function () {
  return this.status === this.process_states.RUNNING;
}

ProcessHandler.prototype.isFinished = function () {
  return this.status === this.process_states.FINISHED;
}


var AsyncPool = function (timeout, maxPoolSize) {
  this.queue = [];
  this.slots = [];
  this.wait = 2000;
  this.maxPoolSize = maxPoolSize || os.cpus().length;
  this.finalized = false;
  this.events = {
    exit: function () {},
    message: function () {}
  };
  this.timeout = timeout || ( 60 * 1000);
  setTimeout(this.run.bind(this), this.wait);
};

AsyncPool.prototype.add = function (file, message) {

  this.queue.push(new ProcessHandler(file, message, this.events));
  console.log('Proc added: ', file)
}

AsyncPool.prototype.anyRunning = function () {
  var running = false;
  this.slots.forEach(function (element){
    if (element.isRunning()) {
      running = true;
    }
  });
  return running;
}

AsyncPool.prototype.run = function (file, message) {

  for (var i = 0; i < this.maxPoolSize && this.queue.length > 0; i++) {

    if (this.slots[i]) {
      if (!this.slots[i].isFinished()) {
        continue;
      }
    }

    var proc = this.queue.pop();
    if (proc.isReady()) {
      proc.run()
    }
    this.slots[i] = proc;
  }

  if (this.queue.length === 0 && this.anyRunning() && !this.finalized) {
    // no more procs, neither buffer nor queue.
    setTimeout(function () {
      this.finalized = true;
      this.events['finish']();
    }.bind(this), this.wait);
  }
  // queue is not empty yet, call run again()
  setTimeout(this.run.bind(this), this.wait);
}

AsyncPool.prototype.on = function (event, fnc) {
  this.events[event] = fnc;
};

module.exports = AsyncPool;
