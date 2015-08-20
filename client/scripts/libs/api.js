var url = '//' + document.location.host + '/api';

function api(path) {
  var xhr = new XMLHttpRequest();

  return {
    get: function(callback) {
      xhr.open('GET', url + path);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.addEventListener('load', function() {
        var response = null;

        if (xhr.response) response = JSON.parse(xhr.response).payload

        callback(response, xhr.status);
      });
      xhr.send();
    },

    put: function(data, callback) {
      xhr.open('PUT', url + path);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.addEventListener('load', function() {
        var response = null;

        if (xhr.response) response = JSON.parse(xhr.response).payload

        callback(response, xhr.status);
      });
      xhr.send(JSON.stringify(data));
    },
  }
}

module.exports = api;