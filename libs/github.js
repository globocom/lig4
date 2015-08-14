'use strict';

var request = require('request');

var Endpoints = {
  'ACCESS_TOKEN_URL': 'https://github.com/login/oauth/access_token',
  'AUTHORIZE_BASE_URL': 'https://github.com/login/oauth/authorize?client_id=',
  'API_BASE_URL': 'https://api.github.com'
}

function Github(client_id, client_secret) {
  this.client_id = client_id;
  this.client_secret = client_secret;
}

Github.prototype.token = function (code, session, callback) {

  if (session.access_token) return callback(session.access_token);

  var data = {
    'json': {
      'client_id': this.client_id,
      'client_secret': this.client_secret,
      'code': code
    }
  };

  request.post(Endpoints.ACCESS_TOKEN_URL, data, function (error, response, body) {

    console.log('Github token: ', error, null, body)

    session.access_token = body.access_token;

    if (body.error) error = body;
    callback(error, session.access_token);
  });
}

Github.prototype.get = function (endpoint, token, callback) {
  var options = {
    'url': Endpoints.API_BASE_URL + endpoint,
    'headers': {
      'Authorization': 'token ' + token,
      'User-Agent': 'Lig4 Game!',
      'Accept': 'application/json'
    }
  };

  request.get(options, function (error, response, body) {
    console.log('Github get: ', error, null, body)

    if (body.error) error = body;
    callback(error, JSON.parse(body));
  });
}

module.exports = {
  'Github': Github,
  'Endpoints': Endpoints
}
