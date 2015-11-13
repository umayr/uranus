/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:43, 09/03/15.
 */
'use strict';

let extensions = module.exports = {};
/**
 * Verifies if the string is not empty.
 * Covers space, tab, and new line.
 *
 * @param str
 * @returns {boolean}
 */
extensions.notEmpty = function notEmpty(str) {
  return !str.match(/^[\s\t\r\n]*$/);
};

/**
 * Checks if the length of the string passed is between min and max value provided.
 *
 * @param str
 * @param min
 * @param max
 */
extensions.len = function len(str, min, max) {
  return this.isLength(str, min, max);
};

/**
 * Verifies if the passed string is an URL.
 *
 * @param str
 */
extensions.isUrl = function isUrl(str) {
  return this.isURL(str);
};

/**
 * Checks if the passed string is an IPv6 address
 *
 * @param str
 */
extensions.isIPv6 = function isIPv6(str) {
  return this.isIP(str, 6);
};

/**
 * Verifies if the passed string is an IPv4 address
 *
 * @param str
 */
extensions.isIPv4 = function isIPv4(str) {
  return this.isIP(str, 4);
};

/**
 * Checks the passed string if it is not one of these values provided in an array
 *
 * @param str
 * @param values
 * @returns {boolean}
 */
extensions.notIn = function notIn(str, values) {
  return !this.isIn(str, values);
};

/**
 * Verifies if the regex matches the provided string
 *
 * @param str
 * @param pattern
 * @param modifiers
 * @returns {Array|{index: number, input: string}}
 */
extensions.regex = function regex(str, pattern, modifiers) {
  str += '';
  if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
    pattern = new RegExp(pattern, modifiers);
  }
  return str.match(pattern);
};

/**
 * Exact opposite of `regex`. Returns true if str doesn't match the provided pattern
 *
 * @param str
 * @param pattern
 * @param modifiers
 * @returns {boolean}
 */
extensions.notRegex = function notRegex(str, pattern, modifiers) {
  return !this.regex(str, pattern, modifiers);
};

/**
 * Checks if the passed string is a valid decimal number
 *
 * @param str
 * @returns {boolean|Array|{index: number, input: string}}
 */
extensions.isDecimal = function isDecimal(str) {
  return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
};

/**
 * Verifies is the value passed is not null
 *
 * @param str
 * @returns {boolean}
 */
extensions.notNull = function notNull(str) {
  return !this.isNull(str);
};

/**
 * Validates the rule provided in second parameter if the first parameter is not null
 *
 * @param str
 * @param check
 * @returns {*}
 */
extensions.optional = function optional(str, check) {
  if (this.isNull(str)) {
    return true;
  }
  let args = Array.prototype.slice.call(arguments);
  args.splice(1, 1);
  if (Array.isArray(args[1])) {
    let _tmp = args[1];
    args = [str];
    _tmp.forEach((arg) => {
      args.push(arg);
    });
  }
  return this[check].apply(this, args);
};

/**
 * Validates if the value minimum than provided number
 *
 * @param str
 * @param val
 * @returns {boolean}
 */
extensions.min = function min(str, val) {
  let number = parseFloat(str);
  return isNaN(number) || number >= val;
};

/**
 * Validates if the value maximum than provided number
 *
 * @param str
 * @param val
 * @returns {boolean}
 */
extensions.max = function max(str, val) {
  let number = parseFloat(str);
  return isNaN(number) || number <= val;
};

/**
 * Sugarcoated wrapper over `notRegex`
 *
 * @param str
 * @param pattern
 * @param modifiers
 * @returns {boolean}
 */
extensions.not = function not(str, pattern, modifiers) {
  return this.notRegex(str, pattern, modifiers);
};

/**
 * Forces specific substring
 *
 * @param str
 * @param elem
 * @returns {boolean}
 */
extensions.contains = function contains(str, elem) {
  return str.indexOf(elem) >= 0 && Boolean(elem);
};

/**
 * Does the exact opposite of `contains`. Validates if substring is not present
 *
 * @param str
 * @param elem
 * @returns {boolean}
 */
extensions.notContains = function notContains(str, elem) {
  return !this.contains(str, elem);
};

/**
 * Sugarcoated wrapper over `regex`
 *
 * @param str
 * @param pattern
 * @param modifiers
 * @returns {Array|{index: number, input: string}}
 */
extensions.is = function is(str, pattern, modifiers) {
  return this.regex(str, pattern, modifiers);
};

/**
 * Validates if the provided string is an UUID of type 3
 *
 * @param str
 */
extensions.isUUIDv3 = function isUUIDv3(str) {
  return this.isUUID(str, 3);
};

/**
 * Validates if the provided string is an UUID of type 4
 *
 * @param str
 */
extensions.isUUIDv4 = function isUUIDv4(str) {
  return this.isUUID(str, 4);
};

/**
 * Validates if the provided string is an UUID of type 5.
 *
 * @param str
 */
extensions.isUUIDv5 = function isUUIDv5(str) {
  return this.isUUID(str, 5);
};
