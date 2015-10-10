'use strict';

global.jQuery = require('jquery');
require('bootstrap');

var libphonenumber = require('./libphonenumber');
var bcCountries = require('bc-countries');
var angular = require('angular');

global.angular = angular;
require('../../build/js/templates');

angular.module('bcPhoneNumber', ['bcPhoneNumberTemplates'])
.controller('MainCtrl', function () {

  this.theNumber = '165';
})
.directive('bcPhoneNumber', function () {

  function hasPrefix (number) {
    return (number[0] === '+');
  }

  function getPrefix (number) {
    if (number && number[0] === '+') { return '+'; }
    else                             { return '';  }
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
    return libphonenumber.formatNumber(number, countryCode);
  }

  function changeDialCode (number, newDialCode) {
    if (!number) { return ('+' + newDialCode); }
    else {
      var digits = getDigits(number);
      var oldDialCode = bcCountries.getDialCodeByDigits(digits);

      if (oldDialCode) {
        var numberWithNewDialCode = digits.replace(oldDialCode, newDialCode);
        var prefixedNumber = prefixNumber(numberWithNewDialCode);
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

  function getPreferredCountries (preferredCodes) {
    var preferredCountries = [];

    for (var i = 0; i < preferredCodes.length; i++) {
      var country = bcCountries.getCountryByIso2Code(preferredCodes[i]);
      if (country) { preferredCountries.push(country); }
    }

    return preferredCountries;
  }

  return {
    templateUrl: 'bc-phone-number/bc-phone-number.html',
    scope: {
      preferredCountriesCodes: '@preferredCountries',
      defaultCountryCode: '@defaultCountry',
      isValid: '=',
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      scope.selectedCountry = bcCountries.getCountryByIso2Code(scope.defaultCountryCode || 'us');
      scope.allCountries = bcCountries.getAllCountries();
      scope.number = scope.ngModel;

      if (scope.preferredCountriesCodes) {
        var preferredCodes = scope.preferredCountriesCodes.split(' ');
        scope.preferredCountries = getPreferredCountries(preferredCodes);
      }

      scope.selectCountry = function (country) {
        scope.selectedCountry = country;
        scope.number = scope.ngModel = changeDialCode(scope.number, country.dialCode);
      };

      scope.isCountrySelected = function (country) {
        return country.iso2Code == scope.selectedCountry.iso2Code;
      };

      scope.resetCountry = function () {
        var defaultCountryCode = scope.defaultCountryCode;

        if (defaultCountryCode) {
          scope.selectedCountry = bcCountries.getCountryByIso2Code(defaultCountryCode);
          scope.ngModel = '';
          scope.number = '';
        }
      };

      scope.$watch('number', function (newValue) {
        if (scope.selectedCountry) {
          var number = scope.number;
          var dialCode = bcCountries.getDialCodeByDigits(getDigits(number));
          scope.isValid = libphonenumber.isValidNumber(number, dialCode);
        }
      });

      scope.$watch('number', function(newValue, oldValue) {
        newValue = newValue || '';
        oldValue = oldValue || '';

        var digits = getDigits(newValue);
        var countryCode = bcCountries.getIso2CodeByDigits(digits);

        if (countryCode) {
          var dialCode = bcCountries.getDialCodeByDigits(digits);
          var number = formatNumberCarefully(dialCode, oldValue, newValue);

          if (dialCode !== scope.selectedCountry.dialCode) {
            scope.selectedCountry = bcCountries.getCountryByIso2Code(countryCode);
          }

          scope.ngModel = number;
          scope.number = number;
        }
        else { scope.ngModel = newValue; }
      });
    }
  };
});

module.exports = 'bcPhoneNumber';
