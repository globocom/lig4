'use strict';

var mongoose = require('mongoose');

function disconnect () {
  mongoose.connection.close();
  process.exit(0);
}

// connect to mongo
mongoose.connect(process.env.MONGOLAB_URI, function (err) {
  if (err) {
    console.log(err);
    process.exit(0);
  }
});

// on exit disconnect
process.on('SIGINT', disconnect);

module.exports = mongoose;
