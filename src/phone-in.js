const MAX_SUGGESTIONS = 10;
const KEYS = {
  UP: 38,
  DOWN: 40,
  ESC: 27,
  ENTER: 13,
};

function PhoneIn(containerElem, countries) {
  if (!containerElem) {
    throw new Error('PhoneIn containerElem is not a valid <div>');
  }
  countries = countries || require('./countries.json');

  const _countries = countries.map(country => {
    const { name, code } = country;

    return {
      name,
      code,
      searchTerms: [name.toLowerCase(), '+' + code, code], // ['ireland', '+353', '353']
    };
  });

  let _highlightedIndex = -1;
  let _suggestions = [];
  let _suggestionDivs = [];
  const _countryCodeInput = containerElem.querySelector(
    '.PhoneIn__countryCode'
  );
  // const phoneNumberInput = containerElem.querySelector('.PhoneIn__phoneNumber');
  const _suggestionsContainer = containerElem.querySelector(
    '.PhoneIn__countryCodeSuggestions'
  );

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
    _suggestionDivs = generateSuggestionDivs(userText);
    if (_suggestionDivs.length <= 0) {
      return;
    }

    _highlightedIndex = -1;
    _suggestionsContainer.style.display = 'block';
    _suggestionsContainer.innerHTML = '';
    _suggestionDivs.forEach(div => {
      _suggestionsContainer.appendChild(div);
      div.addEventListener('mousedown', onMouseDownSuggestion, false);
      div.addEventListener('click', onMouseUpSuggestion, false);
    });
    document.addEventListener('keydown', onKeyPress, false);
  };

  const onMouseDownSuggestion = e => {
    const selectedElem = e.currentTarget;
    // selectedElem.classList.add('PhoneIn__Suggestion--hightlighted');

    _suggestionDivs.forEach((div, i) => {
      if (div === selectedElem) {
        selectSuggestion(i);
      }
    });
    _countryCodeInput.focus();
  };

  const onMouseUpSuggestion = () => {
    _countryCodeInput.focus();
  };

  const hideSuggestions = () => {
    _suggestionsContainer.style.display = 'none';
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
    const suggestionElems = _suggestionsContainer.querySelectorAll(
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
  };

  const onKeyPress = e => {
    const { UP, DOWN, ESC, ENTER } = KEYS;

    switch (e.keyCode) {
      case UP:
        previousSuggestion();
        e.preventDefault();
        break;
      case DOWN:
        nextSuggestion();
        e.preventDefault();
        break;
      case ESC:
        hideSuggestions();
        break;
      case ENTER:
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
      const newInputValue = '+' + choice.code;

      // This was necessary to trigger onChange events in react apps
      var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(_countryCodeInput, newInputValue);

      // Not sure if these lines are needed any more
      const ev = new window.Event('input', { bubbles: true });
      ev.simulated = true;
      _countryCodeInput.dispatchEvent(ev);
      const ev2 = new window.Event('change', { bubbles: true });
      ev2.simulated = true;
      _countryCodeInput.dispatchEvent(ev2);

      hideSuggestions();
    }
    _countryCodeInput.focus();
  };

  const generateSuggestionDivs = text => {
    _suggestions = generateSuggestions(text).slice(0, MAX_SUGGESTIONS);
    return _suggestions.map(country => generateSuggestionDiv(text, country));
  };

  const generateSuggestionDiv = (text, country) => {
    const displayString = country.name + '&nbsp; +' + country.code;
    const index = displayString.toLowerCase().indexOf(text.toLowerCase());
    const endIndex = index + text.length;
    const preUnderlinedText = displayString.substring(0, index);
    const underlinedText = displayString.substring(index, endIndex);
    const postUnderlined = displayString.substring(endIndex);
    const template = `
        <div class="PhoneIn__Suggestion">
          <span class="PhoneIn__startNotMatching">${preUnderlinedText} </span>
          <span class="PhoneIn__middleMatching">${underlinedText}</span>
          <span class="PhoneIn__endNotMatching">${postUnderlined}</span>
        </div>
      `;
    const div = document.createElement('div');
    div.innerHTML = template;
    return div.firstElementChild;
  };

  const generateSuggestions = userText => {
    return _countries.filter(country => {
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
