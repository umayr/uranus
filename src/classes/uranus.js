/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:43, 09/03/15.
 */

'use strict';

let validator = require('validator');
let cressida = require('cressida');

let extensions = require('../utils/extensions');
let utils = require('../utils/');

let ValidationItem = require('./item');
let ValidationResult = require('./result');

const DEFAULTS = {
  progressive: false,
  includeName: true
};

module.exports = class Uranus {

  /**
   * Registers all extra extension methods to validator instance.
   *
   * @private
   */
  _registerExtensions() {
    for (let extension of utils.entries(extensions)) {
      this.validator.extend(extension.key, extension.value);
    }
  }

  /**
   * Inner method that perform single validation.
   *
   * @param value
   * @param test
   * @param rule
   * @param name
   * @returns {*}
   * @private
   */
  _exec(value, test, rule, name) {
    if (typeof this.validator[rule] !== 'function') throw new Error(`Invalid validator function: ${rule}`);

    let validatorArgs = test.args || test;

    if (!Array.isArray(validatorArgs)) {
      if (rule === 'isIP') validatorArgs = [];
      else validatorArgs = [validatorArgs];
    }
    else validatorArgs = validatorArgs.slice(0);
    let args = [value].concat(validatorArgs);
    return {
      invalid: !this.validator[rule].apply(validator, args),
      message: this._message(rule, args, name)
    };
  }

  /**
   * Generates message using `cressida`.
   *
   * @param rule
   * @param args
   * @param name
   * @returns {*}
   * @private
   */
  _message(rule, args, name) {
    args.shift();
    if (rule === 'optional') {
      rule = args[0];
      args.shift();
    }
    if (rule === 'is') rule = 'matches';
    if (rule === 'not') rule = '!matches';

    return this.options.includeName && name !== null ? this.cressida(name, rule, args) : this.cressida(rule, args);
  }

  /**
   * Inner method to perform validation over an array.
   *
   * @param src
   * @returns {ValidationResult}
   * @private
   */
  _validateArray(src) {
    let _validity = true;
    let _items = [];
    src.map((item, index) => {
      let src = item.name ? {value: item.value, name: item.name} : item.value;
      let _tmp = this._validateOne(src, item.rules);

      _validity = !_validity ? _validity : _tmp[0];
      _items[index] = _tmp[1];
    });
    return new ValidationResult(_validity, _items);
  }

  /**
   * Inner method to perform validation over a single item.
   * @param src
   * @param rules
   * @returns {*[]}
   * @private
   */
  _validateOne(src, rules) {
    let validity = true;
    let result = {};
    let _value = null;
    let _name = null;

    if (typeof src === 'object' && src !== null && src.constructor.name === 'Object' && typeof src.name !== 'undefined') {
      _name = src.name;
      _value = src.value;
    }
    else _value = src;

    for (let entry of utils.entries(rules)) {
      let rule = entry.key;
      let test = entry.value;

      if (['isUrl', 'isURL', 'isEmail'].indexOf(rule) !== -1) {
        if (typeof test === 'object' && test !== null && test.msg) test = {msg: test.msg};
        else if (test) test = {};
      }

      let _operation = this._exec(_value, test, rule, _name);

      if (_operation.invalid) {
        validity = false;
        result[rule] = new ValidationItem(false, test.msg || _operation.message || `Validation \`${rule}\` failed.`);
        if (this.options.progressive) break;
      }
      else result[rule] = new ValidationItem(true);
    }
    return [validity, result];
  }

  _validateObject(src, rules) {
    let _validity = true;
    let _items = [];

    for (let entry of utils.entries(rules)) {
      let _tmp = this._validateOne(src[entry.key], entry.value);
      _validity = _tmp[0];
      _items[entry.key] = _tmp[1];
      // God, I miss destructuring.
    }
    return new ValidationResult(_validity, _items);
  }

  /**
   * Method to perform validation.
   *
   * @param src
   * @returns {*}
   */
  validateAll(src) {
    if (Array.isArray(src)) return this._validateArray.apply(this, Array.from(arguments));
    else if (src instanceof Object) return this._validateObject.apply(this, Array.from(arguments));
    else throw new Error('Uranus only support array at the moment. Usage: https://github.com/umayr/uranus/blob/develop/README.md#usage');
  }

  /**
   * Performs validation over a single value.
   * @param value
   * @param rules
   * @returns {ValidationResult}
   *
   * @example
   *  var value = 'foo@email.com';
   *  var rules = {
   *     isEmail: true,
   *     notNull: true
   *  };
   *
   *  validator.validateOne(value, rules);
   */
  validateOne(value, rules) {
    let _tmp = this._validateOne(value, rules);
    return new ValidationResult(_tmp[0], _tmp[1]);
  }

  /**
   * Creates new instance of Uranus.
   *
   * @param options
   * @constructor
   */
  constructor(options) {
    this.options = Object.assign({}, DEFAULTS, options);
    this.cressida = cressida.create({includeName: this.options.includeName});
    this.validator = validator;
    this._registerExtensions();
  }

  /**
   * Syntactic static sugar over `validateAll` instance method.
   *
   * @param src
   * @returns {ValidationResult}
   */
  static validateAll(src) {
    let args = Array.from(arguments);
    let options;

    if (Array.isArray(src) && typeof args[1] !== 'undefined') {
      options = args[1];
      args.pop();
    }
    if (src instanceof Object && typeof args[2] !== 'undefined') {
      options = args[2];
      args.pop();
    }
    let instance = new Uranus(options);
    return instance.validateAll.apply(instance, args);
  }

  /**
   * Syntactic static sugar over `validateOne` instance method.
   *
   * @param value
   * @param rules
   * @param options
   * @returns {*}
   */
  static validateOne(value, rules, options) {
    let instance = new Uranus(options);
    return instance.validateOne(value, rules);
  }
};
