/**
 * Author: Umayr Shahid <umayrr@hotmail.co.uk>,
 * Created: 05:30, 09/03/15.
 */

'use strict';

export function* entries(object) {
  for (let key of Object.keys(object)) {
    yield [key, object[key]];
  }
}
