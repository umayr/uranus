/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:43, 09/03/15.
 */

'use strict';

import validator from 'validator';

import * as extensions from '../utils/extensions';
import * as utils from '../utils/index';

import ValidationItem from './item';
import ValidationResult from './result';

const DEFAULT = {
  progressive: false
};

export default class Uranus {
  /**
   * Creates new instance of Uranus.
   *
   * @param options
   * @constructor
   */
  constructor(options = DEFAULT) {
    this.options = options;
    this.validator = validator;

    this._registerExtensions();
  }

  /**
   * Registers all extra extension methods to validator instance.
   *
   * @private
   */
  _registerExtensions() {
    for (let [key, value] of utils.entries(extensions)) {
      this.validator.extend(key, value);
    }
  }

  /**
   * Inner method that perform single validation.
   *
   * @param value
   * @param test
   * @param rule
   * @returns {*}
   * @private
   */
  _validate(value, test, rule) {
    if (typeof this.validator[rule] !== 'function') throw new Error(`Invalid validator function: ${rule}`);

    let validatorArgs = test.args || test;

    if (!Array.isArray(validatorArgs)) {
      if (rule === 'isIP') validatorArgs = [];
      else validatorArgs = [validatorArgs];
    }
    else validatorArgs = validatorArgs.slice(0);
    return this.validator[rule].apply(validator, [value].concat(validatorArgs));
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
      let value = item.value;
      let rules = item.rules;
      _items[index] = {};

      for (let [rule, test] of utils.entries(rules)) {
        if (['isUrl', 'isURL', 'isEmail'].indexOf(rule) !== -1) {
          if (typeof test === 'object' && test !== null && test.msg) test = {msg: test.msg};
          else if (test) test = {};
        }

        if (!this._validate(value, test, rule)) {
          _validity = false;
          _items[index][rule] = new ValidationItem(false, test.msg || `Validation \`${rule}\` failed.`);
          if (this.options.progressive) break;
        }
        else _items[index][rule] = new ValidationItem(true);
      }
    });
    return new ValidationResult(_validity, _items);
  }

  /**
   * Method to perform validation.
   *
   * @param src
   * @returns {*}
   */
  validateAll(src) {
    if (Array.isArray(src)) return this._validateArray(src);
    else throw new Error('Uranus only support array at the moment. Usage: https://github.com/umayr/uranus/blob/develop/README.md#usage');
  }
}
