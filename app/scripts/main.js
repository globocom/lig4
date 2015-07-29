'use strict';

var scrollToSection = require('./libs/scroll');

// elements
var navigationButtons;

// functions
function navigationHandler (e) {
  var button  = e.currentTarget;
  var section = document.getElementById(button.getAttribute('data-section'));

  scrollToSection(section);
}


// main function
function main () {
  navigationButtons = document.getElementsByClassName('navigation-button');

  for (var i = navigationButtons.length - 1; i >= 0; i--) {
    navigationButtons[i].addEventListener('click', navigationHandler);
  }
};

document.addEventListener('DOMContentLoaded', main);