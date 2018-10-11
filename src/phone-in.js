import countries from './countries.json';

// const MAX_SUGGESTIONS = 10;
const KEYS = {
  UP: 38,
  DOWN: 40,
  ESC: 27,
  ENTER: 13,
};

const LOOKUP = countries.map(country => {
  const { name, code } = country;

  return {
    name,
    code,
    searchTerms: [name.toLowerCase(), '+' + code, code], // ['ireland', '+353', '353']
  };
});

function PhoneIn(containerElem) {
  if (!containerElem) {
    throw new Error('PhoneIn containerElem is not a valid <div>');
  }

  const _countryCodeInput = containerElem.querySelector(
    '.PhoneIn__countryCode'
  );
  // const phoneNumberInput = containerElem.querySelector('.PhoneIn__phoneNumber');
  const _suggestionsDiv = containerElem.querySelector(
    '.PhoneIn__countryCodeSuggestions'
  );

  let _highlightedIndex = -1;

  const onBlurCountryCode = e => {
    setTimeout(hideSuggestions, 500);
  };
  const onChangeCountryCode = e => {
    const userText = e.srcElement.value.toLowerCase();

    if (userText.length < 2) {
      hideSuggestions();
    } else {
      showSuggestions(userText);
    }
  };

  const showSuggestions = userText => {
    _highlightedIndex = -1;
    _suggestionsDiv.style.display = 'block';
    _suggestionsDiv.innerHTML = '';
    _suggestionDivs = generateSuggestionDivs(userText);
    _suggestionDivs.forEach(div => {
      console.log('add Click handler');
      _suggestionsDiv.appendChild(div);
      div.addEventListener('mousedown', onMouseDownSuggestion, false);
      div.addEventListener('click', onMouseUpSuggestion, false);
    });
    console.log('addEventListener');
    document.addEventListener('keydown', onKeyPress, false);
  };

  const onMouseDownSuggestion = e => {
    const selectedElem = e.currentTarget;
    // selectedElem.classList.add('PhoneIn__Suggestion--hightlighted');

    console.log('_suggestionDivs', _suggestionDivs);
    console.log('selectedElem', selectedElem);

    _suggestionDivs.forEach((div, i) => {
      if (div === selectedElem) {
        console.log('boom', i);
        selectSuggestion(i);
      }
    });
    _countryCodeInput.focus();
    console.log('onMouseDownSuggestion()');
  };

  const onMouseUpSuggestion = () => {
    console.log('onMouseUpSuggestion');
    _countryCodeInput.focus();
  };

  const hideSuggestions = () => {
    _suggestionsDiv.style.display = 'none';
    console.log('removeEventListener');
    document.removeEventListener('keydown', onKeyPress, false);
  };

  const nextSuggestion = () => {
    _highlightedIndex += 1;
    if (_highlightedIndex >= _suggestions.length) {
      _highlightedIndex = -1;
    }
    paintHightlightedSuggestion();
  };

  const previousSuggestion = () => {
    _highlightedIndex -= 1;
    if (_highlightedIndex < -1) {
      _highlightedIndex = _suggestions.length - 1;
    }
    paintHightlightedSuggestion();
  };

  const paintHightlightedSuggestion = () => {
    const suggestionElems = _suggestionsDiv.querySelectorAll(
      '.PhoneIn__Suggestion'
    );

    for (let i = 0; i < suggestionElems.length; i++) {
      const currentElem = suggestionElems[i];
      if (i === _highlightedIndex) {
        currentElem.classList.add('PhoneIn__Suggestion--hightlighted');
      } else {
        currentElem.classList.remove('PhoneIn__Suggestion--hightlighted');
      }
    }

    console.log('suggestionElems', suggestionElems);
    console.log('_highlightedIndex', _highlightedIndex);
  };

  const onKeyPress = e => {
    console.log('onKeyPress', e.keyCode);

    const { UP, DOWN, ESC, ENTER } = KEYS;

    switch (e.keyCode) {
      case UP:
        console.log('UP');
        previousSuggestion();
        e.preventDefault();
        break;
      case DOWN:
        console.log('DOWN');
        nextSuggestion();
        e.preventDefault();
        break;
      case ESC:
        console.log('ESC');
        hideSuggestions();
        break;
      case ENTER:
        console.log('ENTER');
        selectSuggestion();
        break;
    }
  };

  const selectSuggestion = index => {
    if (Number.isInteger(index) && index >= 0) {
      _highlightedIndex = index;
    }
    const choice = _suggestions[_highlightedIndex];
    if (choice) {
      _countryCodeInput.value = '+' + choice.code;
      hideSuggestions();
    }
    _countryCodeInput.focus();
    console.log('choice', choice);
  };

  let _suggestions = [];
  let _suggestionDivs = [];

  const generateSuggestionDivs = text => {
    _suggestions = generateSuggestions(text);
    return _suggestions.map(country => generateSuggestionDiv(text, country));
  };

  const generateSuggestionDiv = (text, country) => {
    const displayString = country.name + '&nbsp; +' + country.code;
    const index = displayString.indexOf(text);
    const endIndex = index + text.length;
    const startText = displayString.substring(0, index);
    const middleText = displayString.substring(index, endIndex);
    const endText = displayString.substring(endIndex);
    // const a = 'I'
    const template = `
        <div class="PhoneIn__Suggestion">
          <span class="PhoneIn__startNotMatching">${startText} </span>
          <span class="PhoneIn__middleMatching">${middleText}</span>
          <span class="PhoneIn__endNotMatching">${endText}</span>
        </div>
      `;
    const div = document.createElement('div');
    div.innerHTML = template;
    console.log('div', div.firstElementChild);
    return div.firstElementChild;
  };

  const generateSuggestions = userText => {
    return LOOKUP.filter(country => {
      return matchCountry(userText, country.searchTerms);
    });
  };

  const matchCountry = (userText, searchTerms) => {
    const matches = searchTerms.filter(str => str.startsWith(userText));
    return matches.length >= 1;
  };

  _countryCodeInput.addEventListener('input', onChangeCountryCode, false);
  _countryCodeInput.addEventListener('blur', onBlurCountryCode, false);
}
export default PhoneIn;
