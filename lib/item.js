/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 11:25, 04/08/15.
 */

'use strict';

/**
 * Instance for a single validation item result.
 *
 * @param validity
 * @param message
 * @constructor
 */
function ValidationItem(validity, message) {
  this.validity = validity;
  this.message = message;
}

/**
 * Returns raw object without any prototype
 *
 * @returns {isValid: boolean, message: string}
 */
ValidationItem.prototype.getRaw = function getRaw() {
  return {
    isValid: this.isValid,
    message: this.message
  };
};

/**
 * Returns validation message for one validation item
 *
 * @returns {string}
 */
ValidationItem.prototype.getMessage = function getMessage() {
  return this.message || '';
};

/**
 * Returns whether item is valid or not.
 *
 * @returns {boolean}
 */
ValidationItem.prototype.isValid = function isValid() {
  return Boolean(this.validity);
};

module.exports = ValidationItem;
