function PhoneIn(containerElem) {
	console.log("phone-in containerElem", containerElem);
	if (!containerElem) {
		throw new Error("PhoneIn containerElem is not a valid <div>");
	}

	this.containerElem = containerElem;
	this.countryCodeInput = containerElem.querySelector(".phone-in__countryCode");
	this.phoneNumberInput = containerElem.querySelector(".phone-in__phoneNumber");
	this.suggestionsDiv = containerElem.querySelector(
		".phone-in__countryCodeSuggestions"
	);

	const onChangeCountryCode = e => {
		const text = e.srcElement.value;
		console.log("this.suggestionsDiv", this.suggestionsDiv);

		if (text.length < 2) {
			this.suggestionsDiv.style.display = "none";
		} else {
			this.suggestionsDiv.style.display = "block";
			this.suggestionsDiv.innerHTML = 'foo';
		}
	};

	this.countryCodeInput.addEventListener("input", onChangeCountryCode, false);
}
export default PhoneIn;
