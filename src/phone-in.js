import countries from "./countries.json";


const MAX_SUGGESTIONS = 10;

const lookup = countries.map(country => {
	const { name, code } = country;

	// ['Ireland', '+353', '353']
	return [name.toLowerCase(), "+" + code, code];
});

function PhoneIn(containerElem) {
	if (!containerElem) {
		throw new Error("PhoneIn containerElem is not a valid <div>");
	}

	const countryCodeInput = containerElem.querySelector(
		".phone-in__countryCode"
	);
	const phoneNumberInput = containerElem.querySelector(
		".phone-in__phoneNumber"
	);
	const suggestionsDiv = containerElem.querySelector(
		".phone-in__countryCodeSuggestions"
	);

	const onChangeCountryCode = e => {
		const text = e.srcElement.value.toLowerCase();

		if (text.length < 2) {
			suggestionsDiv.style.display = "none";
		} else {
			suggestionsDiv.style.display = "block";
			suggestionsDiv.innerHTML = "";
			generateSuggestionDivs(text).forEach(div => {
				suggestionsDiv.appendChild(div);
			});
		}
	};

	const generateSuggestionDivs = text => {
		const suggestions = generateSuggestions(text);
		return suggestions.map(country => generateSuggestionDiv(text, country));
	};

	const generateSuggestionDiv = (text, country) => {
		const displayString = country[0] + '&nbsp; ' + country[1];
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
		const div = document.createElement("div");
		div.innerHTML = template;
		return div;
	};

	const generateSuggestions = text => {
		return lookup.filter(country => {
			return matchCountry(text, country);
		});
	};

	const matchCountry = (text, countryArray) => {
		const matches = countryArray.filter(str => str.startsWith(text));
		return matches.length >= 1;
	};

	countryCodeInput.addEventListener("input", onChangeCountryCode, false);
}
export default PhoneIn;
