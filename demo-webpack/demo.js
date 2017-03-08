import bcPhoneNumber from '../';

import 'bootstrap/dist/css/bootstrap.css';
import 'bc-css-flags/dist/css/bc-css-flags.css';

angular.module('bcPhoneNumberDemo', [bcPhoneNumber]).controller('MainCtrl', function () {
  this.theNumber = '165';
});
