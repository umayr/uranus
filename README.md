### Uranus [![Build Status](https://travis-ci.org/umayr/uranus.svg)](https://travis-ci.org/umayr/uranus)

Uranus is a wrapper validation utility over chriso's awesome validator.js with some extra extension methods.

#### Install

You can install uranus via `npm` by typing following command:
```
 $ npm install uranus
```

#### Tests

To execute tests:
```
 $ npm test
```

#### Examples

After installing uranus, you can simply use it as:

``` javascript
 var Validator = require('uranus');
 
 var result = Validator.validateAll([
 {
    value: '@foo.com',
    rules: {
      isEmail: true,
      len: [15, 100]
    }
 },{
    value: 'Neptune',
    rules: {
      isAlpha: true,
      isLowercase: true,
      notContains: 'Net'
    }
 }]);
 
 console.log(result.isValid) // false
```
