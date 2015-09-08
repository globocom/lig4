'use strict';

function Dialog() {
  var container = this.container = document.createElement('div');
  var wrapper = this.wrapper = document.createElement('div');
  var closeButton = this.closeButton = document.createElement('button');
  var self = this;

  // set classes and content
  container.className = 'dialog';
  wrapper.className = 'dialog__wrapper';
  closeButton.className = 'dialog__close-button';
  closeButton.innerHTML = '×';

  closeButton.addEventListener('click', function (e) {
    e.preventDefault();

    document.body.removeChild(container);
  });

  // insert elements
  container.appendChild(wrapper);
  container.appendChild(closeButton);

  return {
    show: self.show.bind(self),
  };
}

Dialog.prototype.show = function (content) {
  this.wrapper.innerHTML = content;

  document.body.appendChild(this.container);
}

module.exports = Dialog;
