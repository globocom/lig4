'use strict'

function send(statusCode, status, payload, res, next) {
  res.json(statusCode, {
    status: status,
    payload: payload
  })
  return next()
}

module.exports.send = send
