# bc-countries
[![Build Status](https://travis-ci.org/Ahimta/bc-countries.svg?branch=master)](https://travis-ci.org/Ahimta/bc-countries)
A convenient Javascript countries utilities (e.g: dial codes, country codes, names)

## Installation

### Bower
```bash
bower install --save bc-countries
```

```js
var bcCountries = window.bcCountries;
```

### NPM
```bash
npm install --save bc-countries
```

```js
var bcCountries = require('bc-countries');
```

### Other (not recommended)
Just copy the [dist](https://github.com/Ahimta/bc-countries/tree/master/dist)

## Usage

### Main functions
A country is an object with keys (dialCode, iso2Code, name).
Functions that take `digits`, throw unless `digits` is a string of digits.

1. `getCountryByIso2Code(iso2Code)`: returns the country with iso2 code `code` if exists, `null` otherwise.
2. `getIso2CodeByDigits(digits)`: returns the iso2 code, given that `digits` starts with that country dial code, an empty string otherwise.
3. `getDialCodeByDigits(digits)`: returns the dial code, given that `digits` starts with that country dial code, an empty string otherwise.
4. `getAllCountries()`: returns all countries.

You can find the full documentation [here](https://github.com/Ahimta/bc-countries/tree/master/test.js).
