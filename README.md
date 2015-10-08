# bc-phone-number [![Build Status](https://travis-ci.org/Ahimta/bc-phone-number.svg?branch=master)](https://travis-ci.org/Ahimta/bc-bc-phone-number)

## Usage
```js
angular.module('myApp', ['bcPhoneNumber'])
```
```html
<bc-phone-number ng-model='theNumber' default-country='us' preferred-countries='us gb ca' is-valid='isValid'></bc-phone-number>
```

Note that`ng-model` and `is-valid` are scope variables.
