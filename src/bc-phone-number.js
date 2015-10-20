'use strict';

var bcCountries = require('bc-countries');
var angular = require('angular');

global.angular = angular;
require('../build/js/templates');

angular.module('bcPhoneNumber', ['bcPhoneNumberTemplates', 'ui.bootstrap'])
.service('bcPhoneNumber', function() {

  this.isValid = bcCountries.isValidNumber;
  this.format = bcCountries.formatNumber;
})
.directive('bcPhoneNumber', function() {

  if (typeof (bcCountries) === 'undefined') {
    throw new('bc-countries not found, did you forget to load the Javascript?');
  }

  function getPreferredCountries(preferredCodes) {
    var preferredCountries = [];

    for (var i = 0; i < preferredCodes.length; i++) {
      var country = bcCountries.getCountryByIso2Code(preferredCodes[i]);
      if (country) { preferredCountries.push(country); }
    }

    return preferredCountries;
  }

  return {
    templateUrl: 'bc-phone-number/bc-phone-number.html',
    require: 'ngModel',
    scope: {
      preferredCountriesCodes: '@preferredCountries',
      defaultCountryCode: '@defaultCountry',
      isValid: '=',
      ngModel: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.selectedCountry = bcCountries.getCountryByIso2Code(scope.defaultCountryCode || 'us');
      scope.allCountries = bcCountries.getAllCountries();
      scope.number = scope.ngModel;

      if (scope.preferredCountriesCodes) {
        var preferredCodes = scope.preferredCountriesCodes.split(' ');
        scope.preferredCountries = getPreferredCountries(preferredCodes);
      }

      scope.selectCountry = function(country) {
        scope.selectedCountry = country;
        scope.number = scope.ngModel = bcCountries.changeDialCode(scope.number, country.dialCode);
      };

      scope.isCountrySelected = function(country) {
        return country.iso2Code == scope.selectedCountry.iso2Code;
      };

      scope.resetCountry = function() {
        var defaultCountryCode = scope.defaultCountryCode;

        if (defaultCountryCode) {
          var defaultCountry = bcCountries.getCountryByIso2Code(defaultCountryCode);
          var number = bcCountries.changeDialCode(scope.number, defaultCountry.dialCode);

          scope.selectedCountry = defaultCountry;
          scope.ngModel = number;
          scope.number = number;
        }
      };

      scope.$watch('ngModel', function(newValue) {
        scope.number = newValue;
      });

      scope.$watch('number', function(newValue) {
        ctrl.$setValidity('phoneNumber', bcCountries.isValidNumber(newValue));
        scope.isValid = bcCountries.isValidNumber(newValue);
      });

      scope.$watch('number', function(newValue) {
        if (newValue === '') { scope.ngModel = ''; }
        else if (newValue) {
          var digits = bcCountries.getDigits(newValue);
          var countryCode = bcCountries.getIso2CodeByDigits(digits);

          if (countryCode) {
            var dialCode = bcCountries.getDialCodeByDigits(digits);
            var number = bcCountries.formatNumber(newValue);

            if (dialCode !== scope.selectedCountry.dialCode) {
              scope.selectedCountry = bcCountries.getCountryByIso2Code(countryCode);
            }

            scope.ngModel = number;
            scope.number = number;
          }
          else { scope.ngModel = newValue; }
        }
      });
    }
  };
});

module.exports = 'bcPhoneNumber';
