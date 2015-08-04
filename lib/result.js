/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 11:25, 04/08/15.
 */

'use strict';

/**
 * Instance for whole validation result.
 *
 * @param validity
 * @param items
 * @constructor
 */
function ValidationResult(validity, items) {
  this.validity = validity;
  this.items = items;
}

/**
 * Returns true if all rules are satisfied.
 *
 * @returns {boolean}
 */
ValidationResult.prototype.isValid = function isValid() {
  return Boolean(this.validity);
};

/**
 * Returns all rules result against one value.
 *
 * @param key
 * @returns {object}
 */
ValidationResult.prototype.getItem = function getItem(key) {
  return this.items[key];
};

/**
 * Returns single specific rule result against one value.
 *
 * @param key
 * @param rule
 * @returns {isValid: boolean, message: string}
 */
ValidationResult.prototype.getRule = function getRule(key, rule) {
  return this.items[key][rule].getRaw();
};

/**
 * Returns message for one item.
 *
 * @param key
 * @returns {string}
 */
ValidationResult.prototype.getMessage = function getMessage(key, rule) {
  return this.getRule(key, rule).message || '';
};

module.exports = ValidationResult;
