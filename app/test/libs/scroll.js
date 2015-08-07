'use strict';

var scrollToSection = require('../../scripts/libs/scroll');

var sectionOne = document.createElement('div');
var sectionTwo = document.createElement('div');
var sectionOneTop;
var sectionTwoTop;

sectionOne.style.height = '500px';
sectionTwo.style.height = '500px';

document.body.appendChild(sectionOne);
document.body.appendChild(sectionTwo);

sectionOneTop = sectionOne.getBoundingClientRect().top + window.pageYOffset;
sectionTwoTop = sectionTwo.getBoundingClientRect().top + window.pageYOffset;

describe('scroll', function () {
  beforeEach(function() {
    window.scrollTo(0, 0);
  });

  it('should scroll to section one', function () {
    scrollToSection(sectionOne, 0);
    expect(window.scrollY + sectionOne.getBoundingClientRect().top).toEqual(sectionOneTop);
  });

  it('should scroll to section two them to section one', function () {
    scrollToSection(sectionTwo, 0);
    expect(window.scrollY + sectionTwo.getBoundingClientRect().top).toEqual(sectionTwoTop);

    scrollToSection(sectionOne, 0);
    expect(window.scrollY + sectionOne.getBoundingClientRect().top).toEqual(sectionOneTop);
  });
});
