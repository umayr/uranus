/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:13, 09/03/15.
 */

'use strict';

module.exports = class ValidationItem {
  /**
   * Instance for a single validation item result.
   *
   * @param validity {string}
   * @param [message=''] {string}
   * @constructor
   */
  constructor(validity, message) {
    this.validity = validity;
    this.message = message || '';
  }

  /**
   * Returns raw object without any prototype
   *
   * @returns {{isValid: boolean, message: string}}
   */
  getRaw() {
    return {
      isValid: this.isValid(),
      message: this.getMessage()
    };
  }

  /**
   * Returns whether item is valid or not.
   *
   * @returns {boolean}
   */
  isValid() {
    return Boolean(this.validity);
  }

  /**
   * Returns the message of current instance.
   *
   * @returns {string}
   */
  getMessage() {
    return String(this.message);
  }
};
