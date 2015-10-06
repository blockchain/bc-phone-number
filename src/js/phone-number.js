'use strict';

angular.module('phoneNumber', [])
.controller('MainCtrl', ['$window', function($window) {

  this.theNumber = '165';
}])
.directive('phoneNumber', function () {

  function hasPrefix (number) {
    return (number[0] === '+');
  }

  function getPrefix (number) {
    if (number && number[0] === '+') { return '+';  }
    else                             { return '';   }
  }

  function getDigits (number) {
    if (!number) { return ''; }
    else {
      var prefix = getPrefix(number);

      if (prefix === '+')  { return number.substring(1).replace(/\W/g, ''); }
      else                 { return number.replace(/\W/g, '');              }
    }
  }

  function prefixNumber (number) {
    if (number && !hasPrefix(number)) { return ('+' + number); }
    else                              { return number;         }
  }

  function formatNumber (number, countryCode) {
    return libphonenumber.formatNumber(number, countryCode, true);
  }

  function getCountryCode (digits) {
    return window.countryCodes.longestPrefix(digits).value;
  }

  function getDialCode (digits) {
    return window.countryCodes.longestPrefix(digits).key;
  }

  function changeDialCode (number, newDialCode) {
    if (!number) { return ('+' + newDialCode); }
    else {
      var digits = getDigits(number);
      var oldDialCode = getDialCode(digits);

      if (oldDialCode) {
        var numberWithNewDialCode = digits.replace(oldDialCode, newDialCode);
        var prefixedNumber = ('+' + numberWithNewDialCode);
        var formattedNumber = formatNumber(prefixedNumber, newDialCode);
        return formattedNumber;
      }
      else { return number; }
    }
  }

  function formatNumberCarefully (dialCode, oldValue, newValue) {
    if (newValue.length >= oldValue.length) { return formatNumber(prefixNumber(newValue), dialCode); }
    else                                    { return prefixNumber(newValue);                         }
  }

  function getPreferredCountries (allCountries, preferredCodes) {

    return allCountries.filter(function (country) {

      return preferredCodes.some(function (code) {

        return country.iso2 == code;
      });
    }).map(function (country) {
      return {
        dialCode: country.dialCode,
        name: country.name,
        iso2: country.iso2
      };
    });
  }

  return {
    templateUrl: 'src/html/phone-number.html',
    scope: {
      preferredCountriesCodes: '@preferredCountries',
      defaultCountryCode: '@defaultCountry',
      isValid: '=',
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      scope.selectedCountryCode = scope.defaultCountryCode || 'us';
      scope.allCountries = window.allCountries;
      scope.number = scope.ngModel;

      if (scope.preferredCountriesCodes) {
        var preferredCodes = scope.preferredCountriesCodes.split(' ');
        scope.preferredCountries = getPreferredCountries(window.allCountries, preferredCodes);
      }

      scope.selectCountry = function (country) {
        scope.selectedCountryCode = country.iso2;
        scope.number = scope.ngModel = changeDialCode(scope.number, country.dialCode);
      };

      scope.isCountrySelected = function (country) {
        return country.iso2 == scope.selectedCountryCode;
      };

      scope.resetCountry = function () {
        var defaultCountryCode = scope.defaultCountryCode;

        if (defaultCountryCode) {
          scope.selectedCountryCode = defaultCountryCode;
          scope.ngModel = '';
          scope.number = '';
        }
      };

      scope.$watch('number', function (newValue) {
        if (scope.selectedCountryCode) {
          var number = scope.number;
          var dialCode = getDialCode(getDigits(number));
          scope.isValid = libphonenumber.isValidNumber(number, dialCode);
        }
      });

      scope.$watch('number', function(newValue, oldValue) {
        newValue = newValue || '';
        oldValue = oldValue || '';

        var digits = getDigits(newValue);
        var countryCode = getCountryCode(digits);

        if (countryCode) {
          var dialCode = getDialCode(digits);
          var number = formatNumberCarefully(dialCode, oldValue, newValue);

          scope.selectedCountryCode = countryCode;
          scope.ngModel = number;
          scope.number = number;
        }
        else { scope.ngModel = newValue; }
      });
    }
  };
});
