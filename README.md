![Logo](http://i.imgur.com/JcjT8g5.png)

Uranus is a wrapper validation utility over chriso's awesome [validator.js](https://github.com/chriso/validator.js) with some extra extension methods.

[![Build Status](https://travis-ci.org/umayr/uranus.svg)](https://travis-ci.org/umayr/uranus)   [![npm version](https://badge.fury.io/js/uranus.svg)](http://badge.fury.io/js/uranus) [![tag](http://img.shields.io/github/tag/umayr/uranus.svg)]()   [![npm](http://img.shields.io/npm/dm/uranus.svg)]() [![Code Climate](https://codeclimate.com/github/umayr/uranus/badges/gpa.svg)](https://codeclimate.com/github/umayr/uranus)

#### Installation:
```
 $ npm install --save uranus
```

#### Tests:

To execute tests:
``` bash
 # clone the repo and change directory
 $ git clone https://github.com/umayr/uranus.git && cd $_

 # install local dependencies
 $ npm install
 
 # run tests
 $ npm test
```

#### Usage:

After installing uranus, you can simply use it as:

``` javascript
 var Uranus = require('uranus');
 var result = Uranus.validateAll([
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

There are several ways to apply validations. For bulk validation you can use `validateAll` which supports both `array` and `object`.

``` javascript
 var Uranus = require('uranus');
 
 // For Arrays.
 var result = Uranus.validateAll([
 {
    value: 'foo@gmail.com',
    rules: {
      isEmail: true
    }
 },{
    value: 'Neptune',
    rules: {
      isAlpha: true,
    }
 }]);
 console.log(result.isValid()) // true
 
 // For objects.
 var src = {
    name: 'Neptune',
    email: 'foo@gmail.com'
  };
  
  var rules = {
    name: {
      isAlpha: true
    },
    email: {
      isEmail: true
    }
  }
var result = Uranus.validateAll(src, rules);
console.log(result.isValid()) // true

```

By default Uranus generates subject less error messages itself with the help of [Cressida](https://github.com/umayr/cressida/blob/master/README.md). For e.g:

``` javascript
var rules = {
   isEmail: true
};
Uranus.validateOne('foo@..!!.com', rules);

// ['should be a valid email address.']
```
By default these messages are subjectless. To specify a name, you can do something like this:

``` javascript
// For `validateOne()`:

var rules = {
   isEmail: true
};
Uranus.validateOne({value: 'foo@..!!.com', name: 'Foo'}, rules);
// ['Foo should be a valid email address.']

// For `validateAll()` with an array:

var result = Uranus.validateAll([
        {
          value: 'foo',
          name: 'Foo',
          rules: {
            isEmail: true
          }
        }
      ], {
        includeName: true
      });
// ['Foo should be a valid email address.']

// For `validateAll()` with an object:

var src = {
    email: {
       name: 'Foo',
       value: 'foo@!!!.com'
   }
  };

  var rules = {
    email: {
      isEmail: true
    }
  }
Uranus.validateAll(src, rules);
// ['Foo should be a valid email address.']
```

This feature can be turned off with `includeName` set to false in `options` moreover you can set your own error messages.

``` javascript
var result = Uranus.validateAll([
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

For validating one single value, you can use `validateOne` as:

``` javascript
var value = 'foo@email.com';
var rules = {
   isEmail: true,
   notNull: true
};

Uranus.validateOne(value, rules);
```

Both `validateOne` & `validateAll` methods can also be accessed by creating an instance of Uranus. For example:

``` javascript
 var Uranus = require('uranus');
 var validator = new Uranus();
 
 // validateAll
 var result = validator.validateAll([
 {
    value: 'foo@gmail.com',
    rules: {
      isEmail: true
    }
 },{
    value: 'Neptune',
    rules: {
      isAlpha: true,
    }
 }]);
 console.log(result.isValid()) // true
 
 // validateOne
 var value = 'foo@email.com';
 var rules = {
  isEmail: true,
  notNull: true
 };
  
 var result = validator.validateOne(value, rules);
 console.log(result.isValid()) // true
 
```

By default `validateAll` validates all the rules for all value sets but if you set `progressive` to `true` while creating `Uranus` instance, it will stop iterating through rules when one fails. In that way you can get only one error message for one value instead of getting all, for example:

``` javascript
var validator = new Uranus({ progressive: true });
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
 }]);
 
 console.log(result.getAllMessages())
 // ["Boo! email is invalid"]
```
Note: In case of static methods, options can be provided as the last argument.

Later you can get all of these messages by `getAllMessages()` method. For example,

``` javascript
  var msgs = result.getAllMessages();
  console.log(msgs)
  // ["Boo! email is invalid", "You're either too large or too small.", "meh, only letters, k?", "only lowercase, babes.", "No fishin'"]
```

You can also get message for one specific rule by:

``` javascript
  var msg = result.getMessage(0, 'isEmail'); // where 0 is the index of provided array.
  console.log(msg) // Boo! email is invalid
```

In order to get all rules for one value you can use `getItem()` method, like: 

``` javascript
  var check = result.getItem(0);
  
  console.log(check.isEmail.isValid()) // false
  console.log(check.isEmail.getMessage()) // Boo! email is invalid
  
  console.log(check.len.isValid()) // false
  console.log(check.len.getMessage()) // You're either too large or too small.
```
Note: You can get whole `ValidationItem` by using `getRule()`.

#### Supported Rules:

As mentioned above, Uranus acts like a wrapper to `validator.js` so it supports all validations currently provided by `validator.js`. In addition to that, there are several extra validations that Uranus provides. Some common validations along with their args are as follows:

```
  is: ["^[a-z]+$",'i'],       // will only allow letters
  is: /^[a-z]+$/i,            // same as the previous example using real RegExp
  not: ["[a-z]",'i'],         // will not allow letters
  isEmail: true,              // checks for email format (foo@bar.com)
  isUrl: true,                // checks for url format (http://foo.com)
  isIP: true,                 // checks for IPv4 (129.89.23.1) or IPv6 format
  isIPv4: true,               // checks for IPv4 (129.89.23.1)
  isIPv6: true,               // checks for IPv6 format
  isAlpha: true,              // will only allow letters
  isAlphanumeric: true        // will only allow alphanumeric characters, so "_abc" will fail
  isNumeric: true             // will only allow numbers
  isInt: true,                // checks for valid integers
  isFloat: true,              // checks for valid floating point numbers
  isDecimal: true,            // checks for any numbers
  isLowercase: true,          // checks for lowercase
  isUppercase: true,          // checks for uppercase
  notNull: true,              // won't allow null
  isNull: true,               // only allows null
  notEmpty: true,             // don't allow empty strings
  equals: 'specific value',   // only allow a specific value
  contains: 'foo',            // force specific substrings
  optional: ['isUrl']         // validate the rule provided in second parameter if first param is not null
  notIn: [['foo', 'bar']],    // check the value is not one of these
  isIn: [['foo', 'bar']],     // check the value is one of these
  notContains: 'bar',         // don't allow specific substrings
  len: [2,10],                // only allow values with length between 2 and 10
  isUUID: 4,                  // only allow uuids
  isDate: true,               // only allow date strings
  isAfter: "2011-11-05",      // only allow date strings after a specific date
  isBefore: "2011-11-05",     // only allow date strings before a specific date
  max: 23,                    // only allow values
  min: 23,                    // only allow values >= 23
  isArray: true,              // only allow arrays
  isCreditCard: true          // check for valid credit card numbers
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
