/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:19, 09/03/15.
 */

'use strict';

let entries = require('../utils').entries;

module.exports = class ValidationResult {
  /**
   * Instance for whole validation result.
   *
   * @param validity {boolean}
   * @param items {Array}
   * @constructor
   */
  constructor(validity, items) {
    this.validity = validity;
    this.items = Array.isArray(items) ? items : [items];
  }

  /**
   * Returns true if all rules are satisfied.
   *
   * @returns {boolean}
   */
  isValid() {
    return Boolean(this.validity);
  }

  /**
   * Returns all rules result against one value.
   *
   * @param key {string}
   * @returns {*}
   */
  getItem(key) {
    return this.items[key];
  }

  /**
   * Returns single specific rule result against one value.
   *
   * @param key {string}
   * @param rule {string}
   * @returns {{isValid, message}|{isValid: boolean, message: string}}
   */
  getRule(key, rule) {
    return this.items[key][rule].getRaw();
  }

  /**
   * Returns message for one item.
   *
   * @param key {string}
   * @param rule {string}
   * @returns {*|string}
   */
  getMessage(key, rule) {
    return this.getRule(key, rule).getMessage();
  }

  /**
   * Returns all error messages.
   *
   * @returns {Array}
   */
  getAllMessages() {
    let errors = [];
    for (let item of entries(this.items)) {
      let object = item[1];
      for (let props of entries(object)) {
        let name = props[0];
        if (!object[name].isValid()) errors.push(object[name].getMessage());
      }
    }
    return errors;
  }
};
