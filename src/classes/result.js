/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:19, 09/03/15.
 */

'use strict';

import { entries } from '../utils/index';

export default class ValidationResult {
  /**
   * Instance for whole validation result.
   *
   * @param validity
   * @param items
   * @constructor
   */
  constructor(validity, items) {
    this.validity = validity;
    this.items = items;
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
   * @param key
   * @returns {*}
   */
  getItem(key) {
    return this.items[key];
  }

  /**
   * Returns single specific rule result against one value.
   *
   * @param key
   * @param rule
   * @returns {{isValid, message}|{isValid: boolean, message: string}}
   */
  getRule(key, rule) {
    return this.items[key][rule].getRaw();
  }

  /**
   * Returns message for one item.
   *
   * @param key
   * @param rule
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
    this.items.map((item) => {
      for (let [key/*, rule*/] of entries(item)) {
        if (!item[key].isValid()) errors.push(item[key].getMessage());
      }
    });
    return errors;
  }
}
