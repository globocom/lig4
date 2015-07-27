'use strict';

function main () {
  var link = document.createElement('link');

  link.href = 'styles/minor.css';
  link.media = 'none';
  link.rel = 'stylesheet';
  link.addEventListener('load', link.removeAttribute.bind(link, 'media'));

  document.head.appendChild(link);
};

document.addEventListener('DOMContentLoaded', main);