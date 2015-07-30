'use strict'

function send (statusCode, status, payload, res, next) {

  var nextReturn = (statusCode < 400)

  res.json(statusCode, {
    status: status,
    payload: payload
  })
  return next(nextReturn)
}

module.exports.send = send
