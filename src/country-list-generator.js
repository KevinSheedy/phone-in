const countryList = require('./country-list-orig');


countryList.forEach(country => {
  delete country.alpha2;
  delete country.alpha3;
  country.code = country.country_code;
  delete country.country_code;
  country.name = country.country_name;
  delete country.country_name;
  delete country.mobile_begin_with;
  delete country.phone_number_lengths;
});

JSON.stringify(countryList);

