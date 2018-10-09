import countries from './countries.json';

// const MAX_SUGGESTIONS = 10;

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

  const countryCodeInput = containerElem.querySelector('.PhoneIn__countryCode');
  // const phoneNumberInput = containerElem.querySelector('.PhoneIn__phoneNumber');
  const suggestionsDiv = containerElem.querySelector(
    '.PhoneIn__countryCodeSuggestions'
  );

  const onBlurCountryCode = e => {
    suggestionsDiv.style.display = 'none';
  };
  const onChangeCountryCode = e => {
    const text = e.srcElement.value.toLowerCase();

    if (text.length < 2) {
      suggestionsDiv.style.display = 'none';
    } else {
      suggestionsDiv.style.display = 'block';
      suggestionsDiv.innerHTML = '';
      generateSuggestionDivs(text).forEach(div => {
        console.log('append');
        suggestionsDiv.appendChild(div);
      });
    }
  };

  const generateSuggestionDivs = text => {
    const suggestions = generateSuggestions(text);
    return suggestions.map(country => generateSuggestionDiv(text, country));
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

  countryCodeInput.addEventListener('input', onChangeCountryCode, false);
  countryCodeInput.addEventListener('blur', onBlurCountryCode, false);
}
export default PhoneIn;
