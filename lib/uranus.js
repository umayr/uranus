/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 15:44, 16/08/15.
 */

'use strict';

var validator = require('validator');

var ValidationResult = require('./result');
var ValidationItem = require('./item');

var extensions = require('./extensions');

var extend = require('util')._extend;

module.exports = Uranus;

/**
 * Creates new instance of Uranus.
 * @constructor
 */
function Uranus(options) {

  var defaults = {
    progressive: false
  };

  this.options = extend(defaults, options || {});
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
  var __items = [];
  for (var i = 0; i < source.length; i++) {
    var val = source[i].value;
    var rules = source[i].rules;
    __items[i] = {};

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
          __items[i][rule] = new ValidationItem(false, test.msg || 'Validation `' + rule + '` failed.');
          if (this.options.progressive) {
            break;
          }
        }
        else {
          __items[i][rule] = new ValidationItem(true);
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
