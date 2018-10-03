import _ from 'lodash';

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Helloooooooo World', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
console.log('index.js');