import * as bcCountries from 'bc-countries';
import angular from 'angular';
import 'angular-ui-bootstrap';
import './bc-phone-number.css';

export default angular.module('bcPhoneNumber', ['ui.bootstrap'])
.service('bcPhoneNumber', function() {
  this.isValid = bcCountries.isValidNumber;
  this.format = bcCountries.formatNumber;
})
.directive('bcPhoneNumber', () => {
  function getPreferredCountries(preferredCodes) {
    let preferredCountries = [];

    for (let i = 0; i < preferredCodes.length; i++) {
      let country = bcCountries.getCountryByIso2Code(preferredCodes[i]);
      if (country) {
        preferredCountries.push(country);
      }
    }

    return preferredCountries;
  }

  return {
    template: require('./bc-phone-number.html'),
    require: 'ngModel',
    scope: {
      preferredCountriesCodes: '@preferredCountries',
      defaultCountryCode: '@defaultCountry',
      selectedCountry: '=?',
      isValid: '=',
      ngModel: '=',
      ngChange: '&',
      ngDisabled: '=',
      name: '@',
      label: '@'
    },
    link: (scope, element, attrs, ctrl) => {
      scope.selectedCountry = bcCountries.getCountryByIso2Code(scope.defaultCountryCode || 'us');
      scope.allCountries = bcCountries.getAllCountries();
      scope.number = scope.ngModel;
      scope.changed = () => {
        scope.ngChange();
      };

      if (scope.preferredCountriesCodes) {
        let preferredCodes = scope.preferredCountriesCodes.split(' ');
        scope.preferredCountries = getPreferredCountries(preferredCodes);
      }

      scope.selectCountry = country => {
        scope.selectedCountry = country;
        scope.number = scope.ngModel = bcCountries.changeDialCode(scope.number, country.dialCode);
      };

      scope.isCountrySelected = country => country.iso2Code == scope.selectedCountry.iso2Code;

      scope.resetCountry = () => {
        let defaultCountryCode = scope.defaultCountryCode;

        if (defaultCountryCode) {
          let defaultCountry = bcCountries.getCountryByIso2Code(defaultCountryCode);
          let number = bcCountries.changeDialCode(scope.number, defaultCountry.dialCode);

          scope.selectedCountry = defaultCountry;
          scope.ngModel = number;
          scope.number = number;
        }
      };

      scope.resetCountry();

      scope.$watch('ngModel', newValue => {
        scope.number = newValue;
      });

      scope.$watch('number', newValue => {
        ctrl.$setValidity('phoneNumber', bcCountries.isValidNumber(newValue));
        scope.isValid = bcCountries.isValidNumber(newValue);
      });

      scope.$watch('number', newValue => {
        if (newValue === '') { scope.ngModel = ''; }
        else if (newValue) {
          let digits = bcCountries.getDigits(newValue);
          let countryCode = bcCountries.getIso2CodeByDigits(digits);

          if (countryCode) {
            let dialCode = bcCountries.getDialCodeByDigits(digits);
            let number = bcCountries.formatNumber(newValue);

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
}).name;
