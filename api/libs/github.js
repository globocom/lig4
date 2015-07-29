'use strict'

function validateRequest() {

  // access github api
  // validate "logged"user

  function valid(req, res, next) {
    // if is valid, return next()
    return next()
    // return Response.send(400) && next false
  }

  return (valid)
}

module.exports.validateRequest = validateRequest
