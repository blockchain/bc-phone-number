# bc-phone-number [![Build Status](https://travis-ci.org/blockchain/bc-phone-number.svg?branch=master)](https://travis-ci.org/blockchain/bc-phone-number)

## Installation

### Bower
```bash
bower install --save bc-phone-number
```
```js
angular.module('myApp', ['bcPhoneNumber'])
```

### NPM
```bash
npm install --save bc-phone-number
```
```js
angular.module('myApp', [require('bc-phone-number')])
```

### Other (not recommended)
Just download the [dist](https://github.com/blockchain/bc-phone-number/tree/master/dist) folder.

## Usage
```html
<bc-phone-number ng-model='theNumber' default-country='us' preferred-countries='us gb ca' is-valid='isValid'></bc-phone-number>
```

```js
angular.module('myModule', ['bcPhoneNumber', function(bcPhoneNumber) {

  scope.formattedNumber = bcPhoneNumber.format('966501234567');
  scope.isValid = bcPhoneNumber.isValid(scope.formattedNumber);
}]);
```

Note that`ng-model` and `is-valid` are scope variables.

## Release

Build a new version:

```sh
gulp build
```

Update version in bower.json and package.json and commit:

```sh
git commit -a -m "Release 5.0.8"
```

Tag, sign and push:

```sh
git tag -s v5.0.8 -m "v5.0.8"
git push --tags
```
