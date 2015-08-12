'use strict'

function send (statusCode, status, payload, res, next) {

  res.status(statusCode).json({
    status: status,
    payload: payload
  });

  return next();
}

module.exports.send = send;
