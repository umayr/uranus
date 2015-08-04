### Uranus [![Build Status](https://travis-ci.org/umayr/uranus.svg)](https://travis-ci.org/umayr/uranus)

Uranus is a wrapper validation utility over chriso's awesome [validator.js](https://github.com/chriso/validator.js) with some extra extension methods.

#### Install:

You can install uranus via `npm` by typing following command:
```
 $ npm install uranus
```

#### Tests:

To execute tests:
``` bash
 # Install globally required packages
 $ npm install -g mocha grunt-cli 
 
 # Install local dependencies
 $ npm install
 
 # Run tests
 $ npm test
```

#### Usage:

After installing uranus, you can simply use it as:

``` javascript
 var Uranus = require('uranus');
 var validator = new Uranus();
 var result = validator.validateAll([
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
 
 console.log(result.isValid()) // false
```

By default uranus sets error messages itself like `Validation ``<rulename>`` failed.` but you can set your own error messages.

``` javascript
var result = validator.validateAll([
 {
    value: '@foo.com',
    rules: {
      isEmail: {
        args: true,
        msg: 'Boo! email is invalid'
      },
      len: {
        args: [15, 100],
        msg: 'You\'re either too large or too small.'
      }
    }
 },{
    value: 'Neptune',
    rules: {
      isAlpha: {
        args: true,
        msg: 'meh, only letters, k?'
      },
      isLowercase: {
        args: true,
        msg: 'only lowercase, babes.'
      },
      notContains: {
        args: 'Net',
        msg: 'No fishin\''
      }
    }
 }]);
```

Later you can get these messages by `getMessage()` method. For example, to get error message for `isEmail` for the first value:

``` javascript
  var msg = result.getMessage('@foo.com', 'isEmail');
  console.log(msg) // Boo! email is invalid
```

In order to get all rules for one value you can use `getItem()` method, like: 

``` javascript
  var check = result.getItem('@foo.com');
  
  console.log(check.isEmail.isValid()) // false
  console.log(check.isEmail.getMessage()) // Boo! email is invalid
  
  console.log(check.len.isValid()) // false
  console.log(check.len.getMessage()) // You're either too large or too small.
```
Note: You can get whole `ValidationItem` by using `getRule()`.

#### Supported Rules:

As mentioned above, Uranus acts like a wrapper to `validator.js` so it supports all validations currently provided by `validator.js`. In addition to that, there are several extra validations that Uranus provides. Some common validations along with their args are as follows:

```
  is: ["^[a-z]+$",'i'],     // will only allow letters
  is: /^[a-z]+$/i,          // same as the previous example using real RegExp
  not: ["[a-z]",'i'],       // will not allow letters
  isEmail: true,            // checks for email format (foo@bar.com)
  isUrl: true,              // checks for url format (http://foo.com)
  isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
  isIPv4: true,             // checks for IPv4 (129.89.23.1)
  isIPv6: true,             // checks for IPv6 format
  isAlpha: true,            // will only allow letters
  isAlphanumeric: true      // will only allow alphanumeric characters, so "_abc" will fail
  isNumeric: true           // will only allow numbers
  isInt: true,              // checks for valid integers
  isFloat: true,            // checks for valid floating point numbers
  isDecimal: true,          // checks for any numbers
  isLowercase: true,        // checks for lowercase
  isUppercase: true,        // checks for uppercase
  notNull: true,            // won't allow null
  isNull: true,             // only allows null
  notEmpty: true,           // don't allow empty strings
  equals: 'specific value', // only allow a specific value
  contains: 'foo',          // force specific substrings
  notIn: [['foo', 'bar']],  // check the value is not one of these
  isIn: [['foo', 'bar']],   // check the value is one of these
  notContains: 'bar',       // don't allow specific substrings
  len: [2,10],              // only allow values with length between 2 and 10
  isUUID: 4,                // only allow uuids
  isDate: true,             // only allow date strings
  isAfter: "2011-11-05",    // only allow date strings after a specific date
  isBefore: "2011-11-05",   // only allow date strings before a specific date
  max: 23,                  // only allow values
  min: 23,                  // only allow values >= 23
  isArray: true,            // only allow arrays
  isCreditCard: true        // check for valid credit card numbers
```

Checkout [`Validator.js`](https://github.com/chriso/validator.js) project for more details on supported validations.
Note: If a rule is supported by `validator.js` but it doesn't work properly in Uranus, please feel free to report an issue.

#### License:

```
The MIT License (MIT)

Copyright (c) 2015 Umayr Shahid <umayrr@hotmail.co.uk>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
