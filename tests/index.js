/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 01:01, 03/08/15.
 */

'use strict';

var Uranus = require('../index.js');
var format = require('util').format;

var assert = require('assert');

function test(options) {
  if (options.valid) {
    options.valid.forEach(function (valid) {
      var validator = new Uranus();
      var response = validator.validateAll([make(valid, options.validator, options.args, options.msg)]);
      if (!response.isValid()) {
        throw new Error(
          format('It failed the test when it should fucking not. [Rule: %s, Value: %s]',
            options.validator,
            valid)
        );
      }
    });
  }
  if (options.invalid) {
    options.invalid.forEach(function (invalid) {
      var validator = new Uranus();
      var response = validator.validateAll([make(invalid, options.validator, options.args, options.msg)]);
      if (response.isValid()) {
        throw new Error(
          format('It passed the test when it should fucking not. [Rule: %s, Value: %s]',
            options.validator,
            invalid)
        );
      }
    });
  }

  function make(value, validator, args, message) {
    var src = {rules: {}};
    src.value = value;
    if (typeof args !== 'undefined') {
      src.rules[validator] = {
        msg: message,
        args: args
      };
    }
    else {
      src.rules[validator] = true;
    }

    return src;
  }
}

describe('validator', function () {
  it('should validate email addresses', function () {
    test({
      validator: 'isEmail',
      valid: [
        'foo@bar.com',
        'x@x.au',
        'foo@bar.com.au',
        'foo+bar@bar.com',
        'hans.m端ller@test.com',
        'hans@m端ller.com',
        'test|123@m端ller.com',
        'test+ext@gmail.com',
        'some.name.midd.leNa.me.+extension@GoogleMail.com',
        'gmail...ignores...dots...@gmail.com',
        '"foobar"@example.com',
        '"  foo  m端ller "@example.com',
        '"foo\\@bar"@example.com'
      ],
      invalid: [
        'invalidemail@',
        'invalid.com',
        '@invalid.com',
        'foo@bar.com.',
        'foo@bar.co.uk.',
        'z@co.c'
      ]
    });
  });
  it('should validate URLs', function () {
    test({
      validator: 'isUrl',
      valid: [
        'foobar.com',
        'www.foobar.com',
        'foobar.com/',
        'valid.au',
        'http://www.foobar.com/',
        'http://www.foobar.com:23/',
        'http://www.foobar.com:65535/',
        'http://www.foobar.com:5/',
        'https://www.foobar.com/',
        'ftp://www.foobar.com/',
        'http://www.foobar.com/~foobar',
        'http://user:pass@www.foobar.com/',
        'http://user:@www.foobar.com/',
        'http://127.0.0.1/',
        'http://10.0.0.0/',
        'http://189.123.14.13/',
        'http://duckduckgo.com/?q=%2F',
        'http://foobar.com/t$-_.+!*\'(),',
        'http://localhost:3000/',
        'http://foobar.com/?foo=bar#baz=qux',
        'http://foobar.com?foo=bar',
        'http://foobar.com#baz=qux',
        'http://www.xn--froschgrn-x9a.net/',
        'http://xn--froschgrn-x9a.com/',
        'http://foo--bar.com',
        'http://høyfjellet.no',
        'http://xn--j1aac5a4g.xn--j1amh',
        'http://кулік.укр'
      ],
      invalid: [
        'xyz://foobar.com',
        'invalid/',
        'invalid.x',
        'invalid.',
        '.com',
        'http://com/',
        'http://300.0.0.1/',
        'mailto:foo@bar.com',
        'rtmp://foobar.com',
        'http://www.xn--.com/',
        'http://xn--.com/',
        'http://www.foobar.com:0/',
        'http://www.foobar.com:70000/',
        'http://www.foobar.com:99999/',
        'http://www.-foobar.com/',
        'http://www.foobar-.com/',
        'http://www.foo---bar.com/',
        'http://foobar/# lol',
        'http://foobar/? lol',
        'http://foobar/ lol/',
        'http://lol @foobar.com/',
        'http://lol:lol @foobar.com/',
        'http://lol:lol:lol@foobar.com/',
        'http://lol: @foobar.com/',
        'http://www.foo_bar.com/',
        'http://www.foobar.com/\t',
        'http://\n@www.foobar.com/',
        '',
        'http://foobar.com/' + new Array(2083).join('f'),
        'http://*.foo.com',
        '*.foo.com',
        '!.foo.com',
        'http://example.com.',
        'http://localhost:61500this is an invalid url!!!!',
        '////foobar.com',
        'http:////foobar.com'
      ]
    });
  });
  it('should validate IP addresses', function () {
    test({
      validator: 'isIP',
      valid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '2001:41d0:2:a141::1',
        '::ffff:127.0.0.1',
        '::0000',
        '0000::',
        '1::',
        '1111:1:1:1:1:1:1:1',
        'fe80::a6db:30ff:fe98:e946',
        '::',
        '::ffff:127.0.0.1',
        '0:0:0:0:0:ffff:127.0.0.1'
      ],
      invalid: [
        'abc',
        '256.0.0.0',
        '0.0.0.256',
        '26.0.0.256',
        '::banana',
        'banana::',
        '::1banana',
        '::1::',
        '1:',
        ':1',
        ':1:1:1::2',
        '1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1',
        '::11111',
        '11111:1:1:1:1:1:1:1',
        '2001:db8:0000:1:1:1:1::1',
        '0:0:0:0:0:0:ffff:127.0.0.1',
        '0:0:0:0:ffff:127.0.0.1'
      ]
    });
    test({
      validator: 'isIPv4',
      valid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4'
      ],
      invalid: [
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1'
      ]
    });
    test({
      validator: 'isIPv6',
      valid: [
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1'
      ],
      invalid: [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::ffff:287.0.0.1'
      ]
    });
  });
  it('should validate alpha strings', function () {
    test({
      validator: 'isAlpha',
      valid: [
        'abc', 'ABC', 'FoObar'
      ],
      invalid: [
        'abc1', '  foo  ', ''
      ]
    });
  });
  it('should validate alphanumeric strings', function () {
    test({
      validator: 'isAlphanumeric',
      valid: [
        'abc123', 'ABC11'
      ],
      invalid: [
        'abc ', 'foo!!'
      ]
    });
  });
  it('should validate numeric strings', function () {
    test({
      validator: 'isNumeric',
      valid: [
        '123', '00123', '-00123', '0', '-0', '+123'
      ],
      invalid: [
        '123.123', ' ', '.'
      ]
    });
  });
  it('should validate decimal numbers', function () {
    test({
      validator: 'isDecimal',
      valid: [
        '123', '00123', '-00123', '0', '-0', '0.01', '.1', '1.0', '-0', '0.0000000000001'
      ],
      invalid: [
        '....', ' ', '0.1a', 'a', '\n'
      ]
    });
  });
  it('should validate lowercase strings', function () {
    test({
      validator: 'isLowercase',
      valid: [
        'abc', 'abc123', 'this is lowercase.', 'tr竪s 端ber'
      ],
      invalid: [
        'fooBar', '123A'
      ]
    });
  });
  it('should validate uppercase strings', function () {
    test({
      validator: 'isUppercase',
      valid: [
        'ABC', 'ABC123', 'ALL CAPS IS FUN.', '   .'
      ],
      invalid: [
        'fooBar', '123abc'
      ]
    });
  });
  it('should validate integers', function () {
    test({
      validator: 'isInt',
      valid: [
        '13', '123', '0', '123', '-0', '+1'
      ],
      invalid: [
        '01', '-01', '000', '100e10', '123.123', '   ', ''
      ]
    });

  });
  it('should validate length', function () {

    test({
      validator: 'len',
      args: [5, 10],
      valid: ['Pizza', 'Steak'],
      invalid: ['Pie', 'Coke', 'Raspberry and Kiwi Cobbler']
    });
  });
  it('should validate floats', function () {
    test({
      validator: 'isFloat',
      valid: [
        '123',
        '123.',
        '123.123',
        '-123.123',
        '-0.123',
        '+0.123',
        '0.123',
        '.0',
        '01.123',
        '-0.22250738585072011e-307'
      ],
      invalid: [
        '-.123', '  ', '', 'foo'
      ]
    });

  });
  it('should validate hexadecimal strings', function () {
    test({
      validator: 'isHexadecimal',
      valid: [
        'deadBEEF', 'ff0044'
      ],
      invalid: [
        'abcdefg', '', '..'
      ]
    });
  });
  it('should validate hexadecimal color strings', function () {
    test({
      validator: 'isHexColor',
      valid: [
        '#ff0034', '#CCCCCC', 'fff', '#f00'
      ],
      invalid: [
        '#ff', 'fff0', '#ff12FG'
      ]
    });
  });
  it('should validate null strings', function () {
    test({
      validator: 'isNull',
      valid: [
        '', NaN, [], undefined, null
      ],
      invalid: [
        ' ', 'foo'
      ]
    });
  });
  it('should validate not null strings', function () {
    test({
      validator: 'notNull',
      valid: [
        ' ', 'foo'
      ],
      invalid: [
        '', NaN, [], undefined, null
      ]
    });
  });
  it('should validate strings against an expected value', function () {
    test({
      validator: 'equals',
      args: 'abc',
      valid: ['abc'],
      invalid: ['Abc', '123']
    });
  });
  it('should validate strings contain another string', function () {
    test({
      validator: 'contains',
      args: ['foo'],
      valid: ['foo', 'foobar', 'bazfoo'],
      invalid: ['bar', 'fobar']
    });
  });
  it('should validate strings against a pattern', function () {
    test({
      validator: 'matches',
      args: [/abc/],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc']
    });
    test({
      validator: 'matches',
      args: ['abc'],
      valid: ['abc', 'abcdef', '123abc'],
      invalid: ['acb', 'Abc']
    });
    test({
      validator: 'matches',
      args: ['abc', 'i'],
      valid: ['abc', 'abcdef', '123abc', 'AbC'],
      invalid: ['acb']
    });
  });
  it('should validate strings by length', function () {
    test({
      validator: 'isLength',
      args: [2],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a']
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd']
    });
    test({
      validator: 'isLength',
      args: [2, 3],
      valid: ['干𩸽', '𠮷野家'],
      invalid: ['', '𠀋', '千竈通り']
    });
  });
  it('should validate strings by byte length', function () {
    test({
      validator: 'isByteLength',
      args: [2],
      valid: ['abc', 'de', 'abcd'],
      invalid: ['', 'a']
    });
    test({
      validator: 'isByteLength',
      args: [2, 3],
      valid: ['abc', 'de'],
      invalid: ['', 'a', 'abcd']
    });
  });
  it('should validate UUIDs', function () {
    test({
      validator: 'isUUIDv4',
      valid: [
        '4a68b601-35bd-4a4a-91a5-f4e634e34943',
        '4fb968a7-cbdd-4755-8b90-b41b60100483',
        '5a65df6a-ae33-4b86-8a4b-37cdc1b84828'
      ],
      invalid: [
        '',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111'
      ]
    });
    test({
      validator: 'isUUIDv3',
      valid: [
        'c478211b-224d-30b1-9116-c06048999ce2'
      ],
      invalid: [
        '',
        '4a68b601-35bd-4a4a-91a5-f4e634e34943',
        '4fb968a7-cbdd-4755-8b90-b41b60100483',
        '5a65df6a-ae33-4b86-8a4b-37cdc1b84828',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111'
      ]
    });
    test({
      validator: 'isUUIDv5',
      valid: [
        '74738ff5-5367-5958-9aee-98fffdcd1876'
      ],
      invalid: [
        '',
        '4a68b601-35bd-4a4a-91a5-f4e634e34943',
        '4fb968a7-cbdd-4755-8b90-b41b60100483',
        '5a65df6a-ae33-4b86-8a4b-37cdc1b84828',
        'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
        'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
        'A987FBC94BED3078CF079141BA07C9F3',
        '934859',
        '987FBC9-4BED-3078-CF07A-9141BA07C9F3',
        'AAAAAAAA-1111-1111-AAAG-111111111111'
      ]
    });
  });
  it('should validate a string that is in another string or array', function () {
    test({
      validator: 'isIn',
      args: ['foobar'],
      valid: ['foo', 'bar', 'foobar', ''],
      invalid: ['foobarbaz', 'barfoo']
    });
    test({
      validator: 'isIn',
      args: [
        ['foo', 'bar']
      ],
      valid: ['foo', 'bar'],
      invalid: ['foobar', 'barfoo', '']
    });
    test({
      validator: 'isIn',
      args: [
        [1, 2, 3]
      ],
      valid: ['1', '2', '3'],
      invalid: ['4', '']
    });
    test({
      validator: 'isIn',
      invalid: [
        'foo',
        ''
      ]
    });
  });
  it('should validate a string that is in another object', function () {
    test({
      validator: 'isIn',
      args: [{
        'foo': 1,
        'bar': 2,
        'foobar': 3
      }],
      valid: [
        'foo',
        'bar',
        'foobar'
      ],
      invalid: [
        'foobarbaz',
        'barfoo',
        ''
      ]
    });
    test({
      validator: 'isIn',
      args: [{
        1: 3,
        2: 0,
        3: 1
      }],
      valid: ['1', '2', '3'],
      invalid: ['4', '']
    });
  });
  it('should validate dates', function () {
    test({
      validator: 'isDate',
      valid: [
        '2011-08-04',
        '04. 08. 2011.',
        '08/04/2011',
        '2011.08.04',
        '4. 8. 2011. GMT',
        '2011-08-04 12:00'
      ],
      invalid: [
        'foo',
        '2011-foo-04',
        'GMT'
      ]
    });
  });
  it('should validate dates against a start date', function () {
    test({
      validator: 'isAfter',
      args: '2011-08-03',
      valid: [
        '2011-08-04',
        new Date(2011, 8, 10)
      ],
      invalid: [
        '2010-07-02',
        '2011-08-03',
        new Date(0),
        'foo'
      ]
    });
  });
  it('should validate dates against an end date', function () {
    test({
      validator: 'isBefore',
      args: ['08/04/2011'],
      valid: [
        '2010-07-02',
        '2010-08-04',
        new Date(0)],
      invalid: [
        '08/04/2011',
        new Date(2011, 9, 10)
      ]
    });
    test({
      validator: 'isBefore',
      args: [new Date(2011, 7, 4)],
      valid: [
        '2010-07-02',
        '2010-08-04',
        new Date(0)
      ],
      invalid: [
        '08/04/2011',
        new Date(2011, 9, 10)
      ]
    });
  });
  it('should validate that integer strings are divisible by a number', function () {
    test({
      validator: 'isDivisibleBy',
      args: [2],
      valid: [
        '2',
        '4',
        '100',
        '1000'],
      invalid: [
        '1',
        '2.5',
        '101',
        'foo',
        ''
      ]
    });
  });
  it('should validate credit cards', function () {
    test({
      validator: 'isCreditCard',
      valid: [
        '375556917985515',
        '36050234196908',
        '4716461583322103',
        '4716-2210-5188-5662',
        '4929 7226 5379 7141',
        '5398228707871527'
      ],
      invalid: [
        'foo',
        'foo',
        '5398228707871528'
      ]
    });
  });
  it('should validate JSON', function () {
    test({
      validator: 'isJSON',
      valid: [
        '{ "key": "value" }', '{}'
      ],
      invalid: [
        '{ key: "value" }', {
          "key": "value"
        }, {
          key: 'value'
        }, '{ \'key\': \'value\' }', 'null', '1234', 'false', '"nope"'
      ]
    });
  });
  it('should validate not empty strings', function () {
    test({
      validator: 'notEmpty',
      valid: [
        'boom', '..', '  .   '
      ],
      invalid: [
        ''
      ]
    });
  });
  it('should validate a string that is not in other string/array', function () {
    test({
      validator: 'notIn',
      args: ['foobar'],
      valid: ['foobarbaz', 'barfoo'],
      invalid: ['foo', 'bar', 'foobar', '']
    });
    test({
      validator: 'notIn',
      args: [
        ['foo', 'bar']
      ],
      valid: ['foobar', 'barfoo', ''],
      invalid: ['foo', 'bar']
    });
    test({
      validator: 'notIn',
      args: [
        [1, 2, 3]
      ],
      valid: ['4', ''],
      invalid: ['1', '2', '3']
    });
    test({
      validator: 'notIn',
      valid: [
        'foo',
        ''
      ]
    });
  });
  it('should validate strings not contain another string', function () {
    test({
      validator: 'notContains',
      args: ['foo'],
      valid: ['bar', 'fobar'],
      invalid: ['foo', 'foobar', 'bazfoo']
    });
  });
  it('should validate minimum numbers', function () {
    test({
      validator: 'min',
      args: 10,
      valid: [11, 100, 2000, 40000, 10.0000001],
      invalid: [1, 2.3, 9.99999]
    });
  });
  it('should validate maximum numbers', function () {
    test({
      validator: 'max',
      args: 10,
      valid: [9.999, 10, 4, 0, 2.4],
      invalid: [101, 50, 10.0000001]
    });
  });
  it('should validate if a regex matches', function () {
    test({
      validator: 'is',
      args: /^[A-Z]{4}$/,
      valid: ['FOOO', 'BAAM', 'YOLO'],
      invalid: [101, 50, 10.0000001, 'FOOOOOO', 'MEH', undefined, '', null]
    });
  });
  it('should validate if a regex doesn\'t match', function () {
    test({
      validator: 'not',
      args: /^[a-z]{4}$/,
      valid: [101, 50, 10.0000001, 'FOOOOOO', 'MEH', 'MEHA', ' fooo', 'yolo\t', 'yada!'],
      invalid: ['fooo', 'baam', 'yolo']
    });
  });
  it('should validate if an object is either null and iff its not then perform second operation', function () {
    test({
      validator: 'optional',
      args: ['isEmail'],
      valid: [null, 'foo@bar.com', '', undefined],
      invalid: ['fooo', 'baam', 'yolo']
    });

    test({
      validator: 'optional',
      args: ['isNumeric'],
      valid: [null, 10, '', undefined],
      invalid: ['fooo', 'baam', 'yolo']
    });

    test({
      validator: 'optional',
      args: ['isUrl'],
      valid: [null, 'https://www.foo.com', '', undefined],
      invalid: ['fooo', 'baam', 'yolo']
    });

    test({
      validator: 'optional',
      args: ['len', [5, 10]],
      valid: [null, 'For realz!', '', undefined],
      invalid: ['fooo', 'baam', 'yolo']
    });
  });
  it('should validate only one condition when `progressive` is true', function () {
    (function () {
      var response = (new Uranus({progressive: true})).validateAll([{
        value: 'foo@gmail',
        rules: {
          isEmail: true,
          isNumeric: true
        }
      }]);
      assert.equal(response.getAllMessages().length, 1);
    }());
    (function () {
      var response = (new Uranus({progressive: true})).validateAll([{
        value: 'foo@gmail.com',
        rules: {
          isEmail: true,
          isNumeric: true
        }
      }]);
      assert.equal(response.getAllMessages().length, 1);
    }());
    (function () {
      var response = (new Uranus()).validateAll([{
        value: 'foo@gmail',
        rules: {
          isEmail: true,
          isNumeric: true
        }
      }]);
      assert.equal(response.getAllMessages().length, 2);
    }());
    (function () {
      var response = (new Uranus({progressive: false})).validateAll([{
        value: 'foo@gmail.com',
        rules: {
          isEmail: true,
          isNumeric: true
        }
      }]);
      assert.equal(response.getAllMessages().length, 1);
    }());
  })
});
