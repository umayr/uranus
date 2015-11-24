/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:30, 09/03/15.
 */

'use strict';

let utils = module.exports = {};

/**
 * Iterate through any iteratable object.
 *
 * @param object
 */
utils.entries = function* entries(object) {
  for (let key of Object.keys(object)) {
    yield {key, value: object[key]};
  }
};
