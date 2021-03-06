/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for db.js
 */

exports.db = {
  getCurrentFilename : function (test) {
    'use strict';

    var db    = require(__dirname + '/../../../lib/db'),
        day   = new Date('July 20, 2014 12:00:00'),
        value = db.getCurrentFilename(day);

    test.strictEqual(value, '2014-07-20', 'Converted timestamp to usable name');
    test.done();
  },

  abbreviateState : function (test) {
    'use strict';

    var db          = require(__dirname + '/../../../lib/db'),
        goodState   = { device1 : { deviceId : 'device', typeClass : 'foo' },
                        device2 : { value : { devices : [{ title : 'Something', value : 'on' }, { title : 'Thing', value : 'off' }] } } },
        abbreviated = db.abbreviateState(goodState);

    test.strictEqual(abbreviated[0].devices,          undefined,   'No devices found');
    test.strictEqual(abbreviated[0].deviceId,         'device1',   'Kept deviceId');
    test.strictEqual(abbreviated[1].deviceId,         'device2',   'Kept deviceId');
    test.strictEqual(abbreviated[1].devices[0].title, 'Something', 'Found subdevice');
    test.strictEqual(abbreviated[1].devices[1].title, 'Thing',     'Found subdevice');

    test.done();
  },

  addRecord : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        allValues;

    db.addRecord('old-device',          'something', { 'old-device' : {} }, 1000);
    db.addRecord('faux-device',         'test',      { 'faux-device' : {} });
    db.addRecord('another-faux-device', 'test',      { 'another-faux-device' : {} });

    allValues = db.returnAllValues();

    test.strictEqual(allValues[0].deviceId,         'old-device',          'Returned value should match set value.');
    test.strictEqual(allValues[0].timestamp,        1,                     'Returned value should match explicit timestamp.');
    test.strictEqual(allValues[1].deviceId,         'faux-device',         'Returned value should match set value.');
    test.strictEqual(typeof allValues[1].timestamp, 'number',              'Returned value should have unix timestamp');
    test.strictEqual(allValues[2].deviceId,         'another-faux-device', 'Returned value should match set value.');

    test.done();
  },

  findDeviceActions : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    deviceValues = db.findDeviceActions('another-faux-device', {});

    test.strictEqual(deviceValues.length, 1, 'Returned value should match set value.');

    test.done();
  },

  findByDeviceId : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    deviceValues = db.findByDeviceId('faux-device', {});

    test.strictEqual(deviceValues.length, 1, 'Returned value should match set value.');

    test.done();
  },

  findByTime : function (test) {
    'use strict';

    var db  = require(__dirname + '/../../../lib/db'),
        now = Math.round(new Date().getTime() / 1000),
        deviceValues;

    deviceValues = db.findByTime((now - 1), 5);

    test.strictEqual(deviceValues.length, 2, 'Returned both values since they\'re both new.');

    test.done();
  },

  returnAllValues : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    deviceValues = db.returnAllValues();

    test.strictEqual(deviceValues.length, 3, 'Returned value should match set value.');

    test.done();
  },

  returnOldestRecord : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    deviceValues = db.returnOldestRecord();

    test.strictEqual(deviceValues.deviceId, 'old-device', 'Returned value should match set value.');

    test.done();
  },

  returnLatestRecord : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    deviceValues = db.returnLatestRecord();

    test.strictEqual(deviceValues.deviceId, 'another-faux-device', 'Returned value should match set value.');

    test.done();
  },

  wipe : function (test) {
    'use strict';

    var db = require(__dirname + '/../../../lib/db'),
        deviceValues;

    db.wipe();
    deviceValues = db.returnAllValues();

    test.strictEqual(deviceValues.length, 0, 'All records should have been removed.');

    test.done();
  }
};
