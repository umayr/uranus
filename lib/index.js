/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 23:50, 02/08/15.
 */

'use strict';

var validator = require('validator');

var ValidationResult = require('./result');
var ValidationItem = require('./item');

var extensions = {
  notEmpty: function (str) {
    return !str.match(/^[\s\t\r\n]*$/);
  },
  len: function (str, min, max) {
    return this.isLength(str, min, max);
  },
  isUrl: function (str) {
    return this.isURL(str);
  },
  isIPv6: function (str) {
    return this.isIP(str, 6);
  },
  isIPv4: function (str) {
    return this.isIP(str, 4);
  },
  notIn: function (str, values) {
    return !this.isIn(str, values);
  },
  regex: function (str, pattern, modifiers) {
    str += '';
    if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
      pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
  },
  notRegex: function (str, pattern, modifiers) {
    return !this.regex(str, pattern, modifiers);
  },
  isDecimal: function (str) {
    return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
  },
  notNull: function (str) {
    return !this.isNull(str);
  },
  min: function (str, val) {
    var number = parseFloat(str);
    return isNaN(number) || number >= val;
  },
  max: function (str, val) {
    var number = parseFloat(str);
    return isNaN(number) || number <= val;
  },
  not: function (str, pattern, modifiers) {
    return this.notRegex(str, pattern, modifiers);
  },
  contains: function (str, elem) {
    return str.indexOf(elem) >= 0 && Boolean(elem);
  },
  notContains: function (str, elem) {
    return !this.contains(str, elem);
  },
  is: function (str, pattern, modifiers) {
    return this.regex(str, pattern, modifiers);
  },
  isUUIDv3: function (str) {
    return this.isUUID(str, 3);
  },
  isUUIDv4: function (str) {
    return this.isUUID(str, 4);
  },
  isUUIDv5: function (str) {
    return this.isUUID(str, 5);
  }
};

/**
 * Creates new instance of Uranus.
 * @constructor
 */
function Uranus() {
  this.validator = validator;
  this.registerExtensions(extensions);
}

/**
 * Registers extra validators to validator instance.
 *
 * @param extensions
 */
Uranus.prototype.registerExtensions = function registerExtensions(extensions) {
  for (var extension in extensions) {
    if (extensions.hasOwnProperty(extension)) {
      this.validator.extend(extension, extensions[extension]);
    }
  }
};

/**
 * Method to perform validation.
 *
 * @param source
 * @returns {ValidationResult}
 */
Uranus.prototype.validateAll = function validateAll(source) {
  var __isValid = true;
  var __items = {};
  for (var i = 0; i < source.length; i++) {
    var val = source[i].value;
    var rules = source[i].rules;
    __items[val] = {};

    for (var rule in rules) {
      if (rules.hasOwnProperty(rule)) {
        var test = rules[rule];
        if (['isUrl', 'isURL', 'isEmail'].indexOf(rule) !== -1) {
          if (typeof test === 'object' && test !== null && test.msg) {
            test = {
              msg: test.msg
            };
          } else if (test === true) {
            test = {};
          }
        }

        if (!this.validate(val, test, rule)) {
          __isValid = false;
          __items[val][rule] = new ValidationItem(false, test.msg || 'Validation `' + rule + '` failed.');
        }
        else {
          __items[val][rule] = new ValidationItem(true);
        }
      }
    }
  }
  return new ValidationResult(__isValid, __items);
};

/**
 * Inner method that perform single validation.
 *
 * @param value
 * @param test
 * @param rule
 * @returns {*}
 */
Uranus.prototype.validate = function validate(value, test, rule) {
  if (typeof this.validator[rule] !== 'function') {
    throw new Error('Invalid validator function: ' + rule);
  }

  var validatorArgs = test.args || test;

  if (!Array.isArray(validatorArgs)) {
    if (rule === 'isIP') {
      validatorArgs = [];
    } else {
      validatorArgs = [validatorArgs];
    }
  } else {
    validatorArgs = validatorArgs.slice(0);
  }
  return this.validator[rule].apply(validator, [value].concat(validatorArgs));
};

module.exports = Uranus;
