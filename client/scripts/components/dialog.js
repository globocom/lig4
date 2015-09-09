'use strict';

function Dialog() {
  var container = this.container = document.createElement('div');
  var wrapper = this.wrapper = document.createElement('div');
  var closeButton = this.closeButton = document.createElement('button');
  var contents = this.contents = document.getElementsByClassName('dialog__content');
  var content = this.content = {};
  var self = this;

  // set classes and content
  container.className = 'dialog';
  wrapper.className = 'dialog__wrapper';
  closeButton.className = 'dialog__close-button';
  closeButton.innerHTML = '×';

  // load dialog content
  for (var i = contents.length - 1; i >= 0; i--) {
    var contentElement = contents[i];

    content[contentElement.id] = contentElement.innerHTML;
    contentElement.parentElement.removeChild(contentElement);
  }

  // bind close listener
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

Dialog.prototype.show = function (contentId) {
  this.wrapper.innerHTML = this.content[contentId];
  document.body.appendChild(this.container);
}

module.exports = Dialog;
