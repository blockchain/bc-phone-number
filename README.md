# phone-number [![Build Status](https://travis-ci.org/Ahimta/phone-number.svg?branch=master)](https://travis-ci.org/Ahimta/phone-number)

## Usage
```js
angular.module('myApp', ['phoneNumber'])
```
```html
<phone-number ng-model='theNumber' default-country='us' preferred-countries='us gb ca' is-valid='isValid'></phone-number>
```

Note that`ng-model` and `is-valid` are scope variables.
