(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module("bcPhoneNumberTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bc-phone-number/bc-phone-number.html","<section class=\'input-group\'>\n  <div class=\'input-group-btn\'>\n    <button class=\'btn btn-default\' type=\'button\' ng-click=\'resetCountry()\'>\n      <span class=\'glyphicon iti-flag\' ng-class=\'selectedCountry.iso2Code\'></span>\n    </button>\n    <button type=\'button\' class=\'btn btn-default dropdown-toggle\' data-toggle=\'dropdown\' aria-haspopup=\'true\'\n            aria-expanded=\'false\'>\n      <span class=\'caret\'></span>\n      <span class=\'sr-only\'>Toggle Dropdown</span>\n    </button>\n    <ul class=\'dropdown-menu\' style=\'max-height: 10em; overflow-y: scroll;\'>\n      <li ng-repeat=\'country in preferredCountries\' ng-click=\'selectCountry(country)\'\n          ng-class=\'{active: isCountrySelected(country)}\'>\n        <a href=\'#\' target=\'_self\' style=\'padding-left: 1em\'>\n          <i class=\'glyphicon iti-flag\' ng-class=\'country.iso2Code\' style=\'margin-right: 1em\'></i>\n          <span ng-bind=\'country.name\'></span>\n        </a>\n      </li>\n      <li role=\'separator\' class=\'divider\' ng-show=\'preferredCountries && preferredCountries.length\'></li>\n      <li ng-repeat=\'country in allCountries\' ng-click=\'selectCountry(country)\'\n          ng-class=\'{active: isCountrySelected(country)}\'>\n        <a href=\'#\' target=\'_self\' style=\'padding-left: 1em\'>\n          <i class=\'glyphicon iti-flag\' ng-class=\'country.iso2Code\' style=\'margin-right: 1em\'></i>\n          <span ng-bind=\'country.name\'></span>\n        </a>\n      </li>\n    </ul>\n  </div>\n  <input type=\'tel\' class=\'form-control\' ng-model=\'number\'>\n</section>\n");}]);
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

global.jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
(typeof window !== "undefined" ? window['bootstrap'] : typeof global !== "undefined" ? global['bootstrap'] : null);

var libphonenumber = require('./libphonenumber');
var bcCountries = (typeof window !== "undefined" ? window['bcCountries'] : typeof global !== "undefined" ? global['bcCountries'] : null);
var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../build/js/templates":1,"./libphonenumber":3}],3:[function(require,module,exports){
(function (global){
'use strict';

var libphonenumber = (typeof window !== "undefined" ? window['libphonenumber'] : typeof global !== "undefined" ? global['libphonenumber'] : null);

// get an example number for the given country code
function getExampleNumber(countryCode, national, numberType) {
  try {
    var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var numberObj = phoneUtil.getExampleNumberForType(countryCode, numberType);
    var format = (national) ? libphonenumber.PhoneNumberFormat.NATIONAL : libphonenumber.PhoneNumberFormat.INTERNATIONAL;
    return phoneUtil.format(numberObj, format);
  } catch (e) {
    return "";
  }
}


// format the given number to the given type
function formatNumberByType(number, countryCode, type) {
  try {
    var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var numberObj = phoneUtil.parseAndKeepRawInput(number, countryCode);
    type = (typeof type == "undefined") ? libphonenumber.PhoneNumberFormat.E164 : type;
    return phoneUtil.format(numberObj, type);
  } catch (e) {
    return "";
  }
}


// check if given number is valid
function isValidNumber(number, countryCode) {
  try {
    var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var numberObj = phoneUtil.parseAndKeepRawInput(number, countryCode);
    return phoneUtil.isValidNumber(numberObj);
  } catch (e) {
    return false;
  }
}


// get more info if the validation has failed e.g. too long/too short
function getValidationError(number, countryCode) {
  try {
    var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var numberObj = phoneUtil.parseAndKeepRawInput(number, countryCode);
    return phoneUtil.isPossibleNumberWithReason(numberObj);
  } catch (e) {
    //console.log(e);

    // here I convert thrown errors into ValidationResult enums (if possible)
    if (e == libphonenumber.Error.INVALID_COUNTRY_CODE) {
      return libphonenumber.PhoneNumberUtil.ValidationResult.INVALID_COUNTRY_CODE;
    }
    if (e == libphonenumber.Error.NOT_A_NUMBER) {
      return 4;
    }
    if (e == libphonenumber.Error.TOO_SHORT_AFTER_IDD || e == libphonenumber.Error.TOO_SHORT_NSN) {
      return libphonenumber.PhoneNumberUtil.ValidationResult.TOO_SHORT;
    }
    if (e == libphonenumber.Error.TOO_LONG) {
      return libphonenumber.PhoneNumberUtil.ValidationResult.TOO_LONG;
    }

    // broken
    return -99;
  }
}


// format the given number (optionally add any formatting suffix e.g. a hyphen)
function formatNumber(val, countryCode, addSuffix, allowExtension, isAllowedKey) {
  try {
    var clean = val.replace(/\D/g, ""),
      // NOTE: we use AsYouTypeFormatter because the default format function can't handle incomplete numbers e.g. "+17024" formats to "+1 7024" as opposed to "+1 702-4"
      formatter = new libphonenumber.AsYouTypeFormatter(countryCode),
      // if clean is empty, we still need this to be a string otherwise we get errors later
      result = "",
      next,
      extSuffix = " ext. ";

    if (val.substr(0, 1) == "+") {
      clean = "+" + clean;
    }

    for (var i = 0; i < clean.length; i++) {
      // TODO: improve this so don't just pump in every digit every time - we should just cache this formatter object, and just call inputDigit once each time the user enters a new digit
      next = formatter.inputDigit(clean.charAt(i));
      // if adding this char didn't change the length, or made it smaller (and there's no longer any spaces): that means that formatting failed which means the number was no longer a potentially valid number, so if we're allowing extensions: assume the rest is the ext
      if (allowExtension && result && next.length <= result.length && next.indexOf(" ") == -1) {
        // set flag for extension
        next = -1;
        break;
      }
      result = next;
    }

    // for some reason libphonenumber formats "+44" to "+44 ", but doesn't do the same with "+1"
    if (result.charAt(result.length - 1) == " ") {
      result = result.substr(0, result.length - 1);
    }
    // check if there's a suffix to add (unless there's an ext)
    if (addSuffix && !val.split(extSuffix)[1]) {
      // hack to get formatting suffix
      var test = formatter.inputDigit('5');
      // again the "+44 " problem... (also affects "+45" apparently)
      if (test.charAt(test.length - 1) == " ") {
        test = test.substr(0, test.length - 1);
      }
      // if adding a '5' introduces a formatting char - check if the penultimate char is not-a-number
      var penultimate = test.substr(test.length - 2, 1);
      // Note: never use isNaN without parseFloat
      if (isNaN(parseFloat(penultimate))) {
        // return the new value (minus that last '5' we just added)
        return test.substr(0, test.length - 1);
      } else if (allowExtension && result && test.length <= result.length && test.indexOf(" ") == -1 && !isAllowedKey) {
        // else if the next digit would break the formating, and we're allowing extensions, AND this is not an allowed key: add the suffix
        // NOTE: we must check this is not an allowed key because if it was that means it was the last digit in a valid number and we dont want to add the "ext" suffix in that case. This whole condition is just here to catch the case that: after typing a valid number, they try to type "ext" - this will not automatically add it for them.
        return result + extSuffix;
      }
    }

    // if the clean number contains an extension we need to add it
    if (next == -1) {
      result += extSuffix + clean.substring(i, clean.length);
    }
    return result;
  } catch (e) {
    return val;
  }
}


// get the type of the given number e.g. fixed-line/mobile
function getNumberType(number, countryCode) {
  try {
    var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var numberObj = phoneUtil.parseAndKeepRawInput(number, countryCode);
    return phoneUtil.getNumberType(numberObj)
  } catch (e) {
    // broken
    return -99;
  }
}


// copied this from i18n.phonenumbers.PhoneNumberType in https://code.google.com/p/libphonenumber/source/browse/trunk/javascript/i18n/phonenumbers/phonenumberutil.js and put the keys in quotes to force closure compiler to preserve the keys
// TODO: there must be a way to just tell closure compiler to preserve the keys on i18n.phonenumbers.PhoneNumberType and just export that
var numberType = {
  "FIXED_LINE": 0,
  "MOBILE": 1,
  // In some regions (e.g. the USA), it is impossible to distinguish between
  // fixed-line and mobile numbers by looking at the phone number itself.
  "FIXED_LINE_OR_MOBILE": 2,
  // Freephone lines
  "TOLL_FREE": 3,
  "PREMIUM_RATE": 4,
  // The cost of this call is shared between the caller and the recipient, and
  // is hence typically less than PREMIUM_RATE calls. See
  // http://en.wikipedia.org/wiki/Shared_Cost_Service for more information.
  "SHARED_COST": 5,
  // Voice over IP numbers. This includes TSoIP (Telephony Service over IP).
  "VOIP": 6,
  // A personal number is associated with a particular person, and may be routed
  // to either a MOBILE or FIXED_LINE number. Some more information can be found
  // here: http://en.wikipedia.org/wiki/Personal_Numbers
  "PERSONAL_NUMBER": 7,
  "PAGER": 8,
  // Used for 'Universal Access Numbers' or 'Company Numbers'. They may be
  // further routed to specific offices, but allow one number to be used for a
  // company.
  "UAN": 9,
  // Used for 'Voice Mail Access Numbers'.
  "VOICEMAIL": 10,
  // A phone number is of type UNKNOWN when it does not fit any of the known
  // patterns for a specific region.
  "UNKNOWN": -1
};


// copied this from i18n.phonenumbers.PhoneNumberUtil.ValidationResult in https://code.google.com/p/libphonenumber/source/browse/trunk/javascript/i18n/phonenumbers/phonenumberutil.js and again put the keys in quotes.
// Also: added NOT_A_NUMBER to match libphonenumber.Error.NOT_A_NUMBER
var validationError = {
  "IS_POSSIBLE": 0,
  "INVALID_COUNTRY_CODE": 1,
  "TOO_SHORT": 2,
  "TOO_LONG": 3,
  "NOT_A_NUMBER": 4
};

// copied this from https://github.com/googlei18n/libphonenumber/blob/master/javascript/i18n/phonenumbers/phonenumberutil.js#L883
var numberFormat = {
  "E164": 0,
  "INTERNATIONAL": 1,
  "NATIONAL": 2,
  "RFC3966": 3
};

module.exports = {
  formatNumberByType: formatNumberByType,
  getValidationError: getValidationError,
  getExampleNumber: getExampleNumber,
  getNumberType: getNumberType,
  isValidNumber: isValidNumber,
  formatNumber: formatNumber,

  validationError: validationError,
  numberFormat: numberFormat,
  numberType: numberType
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
