'use strict';

var mongoose = require('mongoose');
var config = require('../config');

function disconnect () {
  mongoose.connection.close();
  process.exit(0);
}

// connect to mongo
mongoose.connect(config.database.uri, function (err) {
  if (err) {
    console.log(err);
    process.exit(0);
  }
});

// on exit disconnect
process.on('SIGINT', disconnect);

module.exports = mongoose;
