import _ from 'lodash';
import PhoneIn from './phone-in';

// PhoneIn();

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Helloooooooo World', 'webpack'], ' ');



  return element;
}

document.body.appendChild(component());
console.log('index.js foo');

const containerElem = document.getElementById('MyPhoneElem');
const phoneIn = new PhoneIn(containerElem);

console.log('phoneIn', phoneIn);