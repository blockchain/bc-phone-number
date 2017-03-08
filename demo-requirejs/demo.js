require.config({
  paths: {
    'bc-phone-number': '../dist/bc-phone-number',
    'bc-countries': '/node_modules/bc-countries/dist/bc-countries',
    'digits-trie': '/node_modules/digits-trie/dist/digits-trie',
    'google-libphonenumber': '/node_modules/google-libphonenumber/dist/browser/libphonenumber',
    'angular-ui-bootstrap': '/node_modules/angular-ui-bootstrap/dist/ui-bootstrap',
    'angular': '/node_modules/angular/angular'
  },
  shim: {
    'angular': {exports: 'angular'},
    'angular-ui-bootstrap': ['angular'],
  }
});

require(['bc-phone-number'], (bcPhoneNumber) => {
  let bcPhoneDemo = angular.module('bcPhoneNumberDemo', [bcPhoneNumber.default]).controller('MainCtrl', function() {
    this.theNumber = '165';
  });

  angular.bootstrap(document, [bcPhoneDemo.name])
});