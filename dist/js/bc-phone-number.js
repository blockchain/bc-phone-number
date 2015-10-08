(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module("bcPhoneNumberTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bc-phone-number/bc-phone-number.html","<section class=\'input-group\'>\n  <div class=\'input-group-btn\'>\n    <button class=\'btn btn-default\' type=\'button\' ng-click=\'resetCountry()\'>\n      <span class=\'glyphicon iti-flag\' ng-class=\'selectedCountryCode\'></span>\n    </button>\n    <button type=\'button\' class=\'btn btn-default dropdown-toggle\' data-toggle=\'dropdown\' aria-haspopup=\'true\'\n            aria-expanded=\'false\'>\n      <span class=\'caret\'></span>\n      <span class=\'sr-only\'>Toggle Dropdown</span>\n    </button>\n    <ul class=\'dropdown-menu\' style=\'max-height: 10em; overflow-y: scroll;\'>\n      <li ng-repeat=\'country in preferredCountries\' ng-click=\'selectCountry(country)\'\n          ng-class=\'{active: isCountrySelected(country)}\'>\n        <a href=\'#\' target=\'_self\' style=\'padding-left: 1em\'>\n          <i class=\'glyphicon iti-flag\' ng-class=\'country.iso2\' style=\'margin-right: 1em\'></i>\n          <span ng-bind=\'country.name\'></span>\n        </a>\n      </li>\n      <li role=\'separator\' class=\'divider\' ng-show=\'preferredCountries\'></li>\n      <li ng-repeat=\'country in allCountries\' ng-click=\'selectCountry(country)\'\n          ng-class=\'{active: isCountrySelected(country)}\'>\n        <a href=\'#\' target=\'_self\' style=\'padding-left: 1em\'>\n          <i class=\'glyphicon iti-flag\' ng-class=\'country.iso2\' style=\'margin-right: 1em\'></i>\n          <span ng-bind=\'country.name\'></span>\n        </a>\n      </li>\n    </ul>\n  </div>\n  <input type=\'tel\' class=\'form-control\' ng-model=\'number\'>\n</section>\n");}]);
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

global.jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
(typeof window !== "undefined" ? window['bootstrap'] : typeof global !== "undefined" ? global['bootstrap'] : null);

var libphonenumber = require('./libphonenumber');
var countries = require('./countries');
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
      var oldDialCode = countries.getDialCode(digits);

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
    templateUrl: 'bc-phone-number/bc-phone-number.html',
    scope: {
      preferredCountriesCodes: '@preferredCountries',
      defaultCountryCode: '@defaultCountry',
      isValid: '=',
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      scope.selectedCountryCode = scope.defaultCountryCode || 'us';
      scope.allCountries = countries.allCountries;
      scope.number = scope.ngModel;

      if (scope.preferredCountriesCodes) {
        var preferredCodes = scope.preferredCountriesCodes.split(' ');
        scope.preferredCountries = getPreferredCountries(countries.allCountries, preferredCodes);
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
          var dialCode = countries.getDialCode(getDigits(number));
          scope.isValid = libphonenumber.isValidNumber(number, dialCode);
        }
      });

      scope.$watch('number', function(newValue, oldValue) {
        newValue = newValue || '';
        oldValue = oldValue || '';

        var digits = getDigits(newValue);
        var countryCode = countries.getCountryCode(digits);

        if (countryCode) {
          var dialCode = countries.getDialCode(digits);
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

module.exports = 'bcPhoneNumber';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../build/js/templates":1,"./countries":3,"./libphonenumber":4}],3:[function(require,module,exports){
'use strict';
// Tell JSHint to ignore this warning: "character may get silently deleted by one or more browsers"
// jshint -W100

// Array of country objects for the flag dropdown.
// Each contains a name, country code (ISO 3166-1 alpha-2) and dial code.
// Originally from https://github.com/mledoze/countries

// then with a couple of manual re-arrangements to be alphabetical
// then changed Kazakhstan from +76 to +7
// and Vatican City from +379 to +39 (see issue 50)
// and Caribean Netherlands from +5997 to +599
// and Curacao from +5999 to +599
// Removed:  Kosovo, Pitcairn Islands, South Georgia

// UPDATE Sept 12th 2015
// List of regions that have iso2 country codes, which I have chosen to omit:
// (based on this information: https://en.wikipedia.org/wiki/List_of_country_calling_codes)
// AQ - Antarctica - all different country codes depending on which "base"
// BV - Bouvet Island - no calling code
// GS - South Georgia and the South Sandwich Islands - "inhospitable collection of islands" - same flag and calling code as Falkland Islands
// HM - Heard Island and McDonald Islands - no calling code
// PN - Pitcairn - tiny population (56), same calling code as New Zealand
// TF - French Southern Territories - no calling code
// UM - United States Minor Outlying Islands - no calling code

// UPDATE the criteria of supported countries or territories (see issue 297)
// Have an iso2 code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// Have a country calling code: https://en.wikipedia.org/wiki/List_of_country_calling_codes
// Have a flag
// Must be supported by libphonenumber: https://github.com/googlei18n/libphonenumber

// Update: converted objects to arrays to save bytes!
// Update: added "priority" for countries with the same dialCode as others
// Update: added array of area codes for countries with the same dialCode as others

// So each country array has the following information:
// [
//    Country name,
//    iso2 code,
//    International dial code,
//    Order (if >1 country with same dial code),
//    Area codes (if >1 country with same dial code)
// ]
var allCountries = [
  [
    "Afghanistan (‫افغانستان‬‎)",
    "af",
    "93"
  ],
  [
    "Albania (Shqipëri)",
    "al",
    "355"
  ],
  [
    "Algeria (‫الجزائر‬‎)",
    "dz",
    "213"
  ],
  [
    "American Samoa",
    "as",
    "1684"
  ],
  [
    "Andorra",
    "ad",
    "376"
  ],
  [
    "Angola",
    "ao",
    "244"
  ],
  [
    "Anguilla",
    "ai",
    "1264"
  ],
  [
    "Antigua and Barbuda",
    "ag",
    "1268"
  ],
  [
    "Argentina",
    "ar",
    "54"
  ],
  [
    "Armenia (Հայաստան)",
    "am",
    "374"
  ],
  [
    "Aruba",
    "aw",
    "297"
  ],
  [
    "Australia",
    "au",
    "61",
    0
  ],
  [
    "Austria (Österreich)",
    "at",
    "43"
  ],
  [
    "Azerbaijan (Azərbaycan)",
    "az",
    "994"
  ],
  [
    "Bahamas",
    "bs",
    "1242"
  ],
  [
    "Bahrain (‫البحرين‬‎)",
    "bh",
    "973"
  ],
  [
    "Bangladesh (বাংলাদেশ)",
    "bd",
    "880"
  ],
  [
    "Barbados",
    "bb",
    "1246"
  ],
  [
    "Belarus (Беларусь)",
    "by",
    "375"
  ],
  [
    "Belgium (België)",
    "be",
    "32"
  ],
  [
    "Belize",
    "bz",
    "501"
  ],
  [
    "Benin (Bénin)",
    "bj",
    "229"
  ],
  [
    "Bermuda",
    "bm",
    "1441"
  ],
  [
    "Bhutan (འབྲུག)",
    "bt",
    "975"
  ],
  [
    "Bolivia",
    "bo",
    "591"
  ],
  [
    "Bosnia and Herzegovina (Босна и Херцеговина)",
    "ba",
    "387"
  ],
  [
    "Botswana",
    "bw",
    "267"
  ],
  [
    "Brazil (Brasil)",
    "br",
    "55"
  ],
  [
    "British Indian Ocean Territory",
    "io",
    "246"
  ],
  [
    "British Virgin Islands",
    "vg",
    "1284"
  ],
  [
    "Brunei",
    "bn",
    "673"
  ],
  [
    "Bulgaria (България)",
    "bg",
    "359"
  ],
  [
    "Burkina Faso",
    "bf",
    "226"
  ],
  [
    "Burundi (Uburundi)",
    "bi",
    "257"
  ],
  [
    "Cambodia (កម្ពុជា)",
    "kh",
    "855"
  ],
  [
    "Cameroon (Cameroun)",
    "cm",
    "237"
  ],
  [
    "Canada",
    "ca",
    "1",
    1,
    ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
  ],
  [
    "Cape Verde (Kabu Verdi)",
    "cv",
    "238"
  ],
  [
    "Caribbean Netherlands",
    "bq",
    "599",
    1
  ],
  [
    "Cayman Islands",
    "ky",
    "1345"
  ],
  [
    "Central African Republic (République centrafricaine)",
    "cf",
    "236"
  ],
  [
    "Chad (Tchad)",
    "td",
    "235"
  ],
  [
    "Chile",
    "cl",
    "56"
  ],
  [
    "China (中国)",
    "cn",
    "86"
  ],
  [
    "Christmas Island",
    "cx",
    "61",
    2
  ],
  [
    "Cocos (Keeling) Islands",
    "cc",
    "61",
    1
  ],
  [
    "Colombia",
    "co",
    "57"
  ],
  [
    "Comoros (‫جزر القمر‬‎)",
    "km",
    "269"
  ],
  [
    "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
    "cd",
    "243"
  ],
  [
    "Congo (Republic) (Congo-Brazzaville)",
    "cg",
    "242"
  ],
  [
    "Cook Islands",
    "ck",
    "682"
  ],
  [
    "Costa Rica",
    "cr",
    "506"
  ],
  [
    "Côte d’Ivoire",
    "ci",
    "225"
  ],
  [
    "Croatia (Hrvatska)",
    "hr",
    "385"
  ],
  [
    "Cuba",
    "cu",
    "53"
  ],
  [
    "Curaçao",
    "cw",
    "599",
    0
  ],
  [
    "Cyprus (Κύπρος)",
    "cy",
    "357"
  ],
  [
    "Czech Republic (Česká republika)",
    "cz",
    "420"
  ],
  [
    "Denmark (Danmark)",
    "dk",
    "45"
  ],
  [
    "Djibouti",
    "dj",
    "253"
  ],
  [
    "Dominica",
    "dm",
    "1767"
  ],
  [
    "Dominican Republic (República Dominicana)",
    "do",
    "1",
    2,
    ["809", "829", "849"]
  ],
  [
    "Ecuador",
    "ec",
    "593"
  ],
  [
    "Egypt (‫مصر‬‎)",
    "eg",
    "20"
  ],
  [
    "El Salvador",
    "sv",
    "503"
  ],
  [
    "Equatorial Guinea (Guinea Ecuatorial)",
    "gq",
    "240"
  ],
  [
    "Eritrea",
    "er",
    "291"
  ],
  [
    "Estonia (Eesti)",
    "ee",
    "372"
  ],
  [
    "Ethiopia",
    "et",
    "251"
  ],
  [
    "Falkland Islands (Islas Malvinas)",
    "fk",
    "500"
  ],
  [
    "Faroe Islands (Føroyar)",
    "fo",
    "298"
  ],
  [
    "Fiji",
    "fj",
    "679"
  ],
  [
    "Finland (Suomi)",
    "fi",
    "358",
    0
  ],
  [
    "France",
    "fr",
    "33"
  ],
  [
    "French Guiana (Guyane française)",
    "gf",
    "594"
  ],
  [
    "French Polynesia (Polynésie française)",
    "pf",
    "689"
  ],
  [
    "Gabon",
    "ga",
    "241"
  ],
  [
    "Gambia",
    "gm",
    "220"
  ],
  [
    "Georgia (საქართველო)",
    "ge",
    "995"
  ],
  [
    "Germany (Deutschland)",
    "de",
    "49"
  ],
  [
    "Ghana (Gaana)",
    "gh",
    "233"
  ],
  [
    "Gibraltar",
    "gi",
    "350"
  ],
  [
    "Greece (Ελλάδα)",
    "gr",
    "30"
  ],
  [
    "Greenland (Kalaallit Nunaat)",
    "gl",
    "299"
  ],
  [
    "Grenada",
    "gd",
    "1473"
  ],
  [
    "Guadeloupe",
    "gp",
    "590",
    0
  ],
  [
    "Guam",
    "gu",
    "1671"
  ],
  [
    "Guatemala",
    "gt",
    "502"
  ],
  [
    "Guernsey",
    "gg",
    "44",
    1
  ],
  [
    "Guinea (Guinée)",
    "gn",
    "224"
  ],
  [
    "Guinea-Bissau (Guiné Bissau)",
    "gw",
    "245"
  ],
  [
    "Guyana",
    "gy",
    "592"
  ],
  [
    "Haiti",
    "ht",
    "509"
  ],
  [
    "Honduras",
    "hn",
    "504"
  ],
  [
    "Hong Kong (香港)",
    "hk",
    "852"
  ],
  [
    "Hungary (Magyarország)",
    "hu",
    "36"
  ],
  [
    "Iceland (Ísland)",
    "is",
    "354"
  ],
  [
    "India (भारत)",
    "in",
    "91"
  ],
  [
    "Indonesia",
    "id",
    "62"
  ],
  [
    "Iran (‫ایران‬‎)",
    "ir",
    "98"
  ],
  [
    "Iraq (‫العراق‬‎)",
    "iq",
    "964"
  ],
  [
    "Ireland",
    "ie",
    "353"
  ],
  [
    "Isle of Man",
    "im",
    "44",
    2
  ],
  [
    "Israel (‫ישראל‬‎)",
    "il",
    "972"
  ],
  [
    "Italy (Italia)",
    "it",
    "39",
    0
  ],
  [
    "Jamaica",
    "jm",
    "1876"
  ],
  [
    "Japan (日本)",
    "jp",
    "81"
  ],
  [
    "Jersey",
    "je",
    "44",
    3
  ],
  [
    "Jordan (‫الأردن‬‎)",
    "jo",
    "962"
  ],
  [
    "Kazakhstan (Казахстан)",
    "kz",
    "7",
    1
  ],
  [
    "Kenya",
    "ke",
    "254"
  ],
  [
    "Kiribati",
    "ki",
    "686"
  ],
  [
    "Kuwait (‫الكويت‬‎)",
    "kw",
    "965"
  ],
  [
    "Kyrgyzstan (Кыргызстан)",
    "kg",
    "996"
  ],
  [
    "Laos (ລາວ)",
    "la",
    "856"
  ],
  [
    "Latvia (Latvija)",
    "lv",
    "371"
  ],
  [
    "Lebanon (‫لبنان‬‎)",
    "lb",
    "961"
  ],
  [
    "Lesotho",
    "ls",
    "266"
  ],
  [
    "Liberia",
    "lr",
    "231"
  ],
  [
    "Libya (‫ليبيا‬‎)",
    "ly",
    "218"
  ],
  [
    "Liechtenstein",
    "li",
    "423"
  ],
  [
    "Lithuania (Lietuva)",
    "lt",
    "370"
  ],
  [
    "Luxembourg",
    "lu",
    "352"
  ],
  [
    "Macau (澳門)",
    "mo",
    "853"
  ],
  [
    "Macedonia (FYROM) (Македонија)",
    "mk",
    "389"
  ],
  [
    "Madagascar (Madagasikara)",
    "mg",
    "261"
  ],
  [
    "Malawi",
    "mw",
    "265"
  ],
  [
    "Malaysia",
    "my",
    "60"
  ],
  [
    "Maldives",
    "mv",
    "960"
  ],
  [
    "Mali",
    "ml",
    "223"
  ],
  [
    "Malta",
    "mt",
    "356"
  ],
  [
    "Marshall Islands",
    "mh",
    "692"
  ],
  [
    "Martinique",
    "mq",
    "596"
  ],
  [
    "Mauritania (‫موريتانيا‬‎)",
    "mr",
    "222"
  ],
  [
    "Mauritius (Moris)",
    "mu",
    "230"
  ],
  [
    "Mayotte",
    "yt",
    "262",
    1
  ],
  [
    "Mexico (México)",
    "mx",
    "52"
  ],
  [
    "Micronesia",
    "fm",
    "691"
  ],
  [
    "Moldova (Republica Moldova)",
    "md",
    "373"
  ],
  [
    "Monaco",
    "mc",
    "377"
  ],
  [
    "Mongolia (Монгол)",
    "mn",
    "976"
  ],
  [
    "Montenegro (Crna Gora)",
    "me",
    "382"
  ],
  [
    "Montserrat",
    "ms",
    "1664"
  ],
  [
    "Morocco (‫المغرب‬‎)",
    "ma",
    "212",
    0
  ],
  [
    "Mozambique (Moçambique)",
    "mz",
    "258"
  ],
  [
    "Myanmar (Burma) (မြန်မာ)",
    "mm",
    "95"
  ],
  [
    "Namibia (Namibië)",
    "na",
    "264"
  ],
  [
    "Nauru",
    "nr",
    "674"
  ],
  [
    "Nepal (नेपाल)",
    "np",
    "977"
  ],
  [
    "Netherlands (Nederland)",
    "nl",
    "31"
  ],
  [
    "New Caledonia (Nouvelle-Calédonie)",
    "nc",
    "687"
  ],
  [
    "New Zealand",
    "nz",
    "64"
  ],
  [
    "Nicaragua",
    "ni",
    "505"
  ],
  [
    "Niger (Nijar)",
    "ne",
    "227"
  ],
  [
    "Nigeria",
    "ng",
    "234"
  ],
  [
    "Niue",
    "nu",
    "683"
  ],
  [
    "Norfolk Island",
    "nf",
    "672"
  ],
  [
    "North Korea (조선 민주주의 인민 공화국)",
    "kp",
    "850"
  ],
  [
    "Northern Mariana Islands",
    "mp",
    "1670"
  ],
  [
    "Norway (Norge)",
    "no",
    "47",
    0
  ],
  [
    "Oman (‫عُمان‬‎)",
    "om",
    "968"
  ],
  [
    "Pakistan (‫پاکستان‬‎)",
    "pk",
    "92"
  ],
  [
    "Palau",
    "pw",
    "680"
  ],
  [
    "Palestine (‫فلسطين‬‎)",
    "ps",
    "970"
  ],
  [
    "Panama (Panamá)",
    "pa",
    "507"
  ],
  [
    "Papua New Guinea",
    "pg",
    "675"
  ],
  [
    "Paraguay",
    "py",
    "595"
  ],
  [
    "Peru (Perú)",
    "pe",
    "51"
  ],
  [
    "Philippines",
    "ph",
    "63"
  ],
  [
    "Poland (Polska)",
    "pl",
    "48"
  ],
  [
    "Portugal",
    "pt",
    "351"
  ],
  [
    "Puerto Rico",
    "pr",
    "1",
    3,
    ["787", "939"]
  ],
  [
    "Qatar (‫قطر‬‎)",
    "qa",
    "974"
  ],
  [
    "Réunion (La Réunion)",
    "re",
    "262",
    0
  ],
  [
    "Romania (România)",
    "ro",
    "40"
  ],
  [
    "Russia (Россия)",
    "ru",
    "7",
    0
  ],
  [
    "Rwanda",
    "rw",
    "250"
  ],
  [
    "Saint Barthélemy (Saint-Barthélemy)",
    "bl",
    "590",
    1
  ],
  [
    "Saint Helena",
    "sh",
    "290"
  ],
  [
    "Saint Kitts and Nevis",
    "kn",
    "1869"
  ],
  [
    "Saint Lucia",
    "lc",
    "1758"
  ],
  [
    "Saint Martin (Saint-Martin (partie française))",
    "mf",
    "590",
    2
  ],
  [
    "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
    "pm",
    "508"
  ],
  [
    "Saint Vincent and the Grenadines",
    "vc",
    "1784"
  ],
  [
    "Samoa",
    "ws",
    "685"
  ],
  [
    "San Marino",
    "sm",
    "378"
  ],
  [
    "São Tomé and Príncipe (São Tomé e Príncipe)",
    "st",
    "239"
  ],
  [
    "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
    "sa",
    "966"
  ],
  [
    "Senegal (Sénégal)",
    "sn",
    "221"
  ],
  [
    "Serbia (Србија)",
    "rs",
    "381"
  ],
  [
    "Seychelles",
    "sc",
    "248"
  ],
  [
    "Sierra Leone",
    "sl",
    "232"
  ],
  [
    "Singapore",
    "sg",
    "65"
  ],
  [
    "Sint Maarten",
    "sx",
    "1721"
  ],
  [
    "Slovakia (Slovensko)",
    "sk",
    "421"
  ],
  [
    "Slovenia (Slovenija)",
    "si",
    "386"
  ],
  [
    "Solomon Islands",
    "sb",
    "677"
  ],
  [
    "Somalia (Soomaaliya)",
    "so",
    "252"
  ],
  [
    "South Africa",
    "za",
    "27"
  ],
  [
    "South Korea (대한민국)",
    "kr",
    "82"
  ],
  [
    "South Sudan (‫جنوب السودان‬‎)",
    "ss",
    "211"
  ],
  [
    "Spain (España)",
    "es",
    "34"
  ],
  [
    "Sri Lanka (ශ්‍රී ලංකාව)",
    "lk",
    "94"
  ],
  [
    "Sudan (‫السودان‬‎)",
    "sd",
    "249"
  ],
  [
    "Suriname",
    "sr",
    "597"
  ],
  [
    "Svalbard and Jan Mayen",
    "sj",
    "47",
    1
  ],
  [
    "Swaziland",
    "sz",
    "268"
  ],
  [
    "Sweden (Sverige)",
    "se",
    "46"
  ],
  [
    "Switzerland (Schweiz)",
    "ch",
    "41"
  ],
  [
    "Syria (‫سوريا‬‎)",
    "sy",
    "963"
  ],
  [
    "Taiwan (台灣)",
    "tw",
    "886"
  ],
  [
    "Tajikistan",
    "tj",
    "992"
  ],
  [
    "Tanzania",
    "tz",
    "255"
  ],
  [
    "Thailand (ไทย)",
    "th",
    "66"
  ],
  [
    "Timor-Leste",
    "tl",
    "670"
  ],
  [
    "Togo",
    "tg",
    "228"
  ],
  [
    "Tokelau",
    "tk",
    "690"
  ],
  [
    "Tonga",
    "to",
    "676"
  ],
  [
    "Trinidad and Tobago",
    "tt",
    "1868"
  ],
  [
    "Tunisia (‫تونس‬‎)",
    "tn",
    "216"
  ],
  [
    "Turkey (Türkiye)",
    "tr",
    "90"
  ],
  [
    "Turkmenistan",
    "tm",
    "993"
  ],
  [
    "Turks and Caicos Islands",
    "tc",
    "1649"
  ],
  [
    "Tuvalu",
    "tv",
    "688"
  ],
  [
    "U.S. Virgin Islands",
    "vi",
    "1340"
  ],
  [
    "Uganda",
    "ug",
    "256"
  ],
  [
    "Ukraine (Україна)",
    "ua",
    "380"
  ],
  [
    "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
    "ae",
    "971"
  ],
  [
    "United Kingdom",
    "gb",
    "44",
    0
  ],
  [
    "United States",
    "us",
    "1",
    0
  ],
  [
    "Uruguay",
    "uy",
    "598"
  ],
  [
    "Uzbekistan (Oʻzbekiston)",
    "uz",
    "998"
  ],
  [
    "Vanuatu",
    "vu",
    "678"
  ],
  [
    "Vatican City (Città del Vaticano)",
    "va",
    "39",
    1
  ],
  [
    "Venezuela",
    "ve",
    "58"
  ],
  [
    "Vietnam (Việt Nam)",
    "vn",
    "84"
  ],
  [
    "Wallis and Futuna",
    "wf",
    "681"
  ],
  [
    "Western Sahara (‫الصحراء الغربية‬‎)",
    "eh",
    "212",
    1
  ],
  [
    "Yemen (‫اليمن‬‎)",
    "ye",
    "967"
  ],
  [
    "Zambia",
    "zm",
    "260"
  ],
  [
    "Zimbabwe",
    "zw",
    "263"
  ],
  [
    "Åland Islands",
    "ax",
    "358",
    1
  ]
];

var Trie = require('./trie');

var countryCodes = new Trie();

// loop over all of the countries above
for (var i = 0; i < allCountries.length; i++) {
  var c = allCountries[i];
  allCountries[i] = {
    name: c[0],
    iso2: c[1],
    dialCode: c[2],
    priority: c[3] || 0,
    areaCodes: c[4] || null
  };

  countryCodes.put(""+c[2], c[1]);
}

function getCountryCode (digits) {
  return countryCodes.longestPrefix(digits).value;
}

function getDialCode (digits) {
  return countryCodes.longestPrefix(digits).key;
}

module.exports = {
  getCountryCode: getCountryCode,
  getDialCode: getDialCode,
  allCountries: allCountries,
  countryCodes: countryCodes
};

},{"./trie":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict';

function Node() {
  this.children = new Array(9);
}

var Nil = new Node();
Nil.isNil = true;
Nil.value = '';
Nil.key = '';

Node.prototype.getChild = function(i) {
  if      (i < 0 || i > 9)   { throw new Error('-_-');               }
  else if (this.children[i]) { return this.children[i];              }
  else                       { return this.children[i] = new Node(); }
}

function Trie () {
  this.root = new Node();
}

Trie.prototype.put = function (key, value) {

  if (!key || key.length < 1) { return; }
  else {
    var node = this.root;

    for (var i = 0; i < key.length - 1; i++) {
      var character = key[i];
      var index = parseInt(character);
      node = node.getChild(index);
    }

    var newNode = node.getChild(parseInt(key[key.length-1]));
    newNode.value = value;
    newNode.key = key;
  }
}

Trie.prototype.get = function (key) {

  if (!key || key.length < 1) { return Nil; }
  else {
    var node = this.root;

    for (var i = 0; node && i < key.length; i++) {
      var character = key[i];
      var index = parseInt(character);

      node = node.children[index];
    }

    if (node && node.value) { return node; }
    else                    { return Nil;  }
  }
}

Trie.prototype.longestPrefix = function (key) {

  if (!key || key.length < 1) { return Nil; }
  else {
    var prevNode = null;
    var node = this.root;

    for (var i = 0; node && i < key.length; i++) {
      var character = key[i];
      var index = parseInt(character);

      if (node.value) { prevNode = node };
      node = node.children[index];
    }

    if      (node && node.value)         { return node;     }
    else if (prevNode && prevNode.value) { return prevNode; }
    else                                 { return Nil;      }
  }
}

module.exports = Trie;

},{}]},{},[2]);
