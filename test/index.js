'use strict';

var test = require('tape');

var hgrx = require('../index');

// FFFfffff--- phantomJS.
if (!Function.prototype.bind) {
    /*eslint no-extend-native: 0*/
    Function.prototype.bind = require('function-bind');
}

test('hgrx is a object', function t(assert) {
    assert.equal(typeof hgrx, 'object');
    assert.end();
});

// jscs:disable disallowKeywords
test('missing element prevents app init', function t(assert) {
    try {
        assert.throws(hgrx);
        hgrx.app(null);
    } catch (exception) {
        assert.equal(exception.message,
            'Element does not exist. Mercury cannot be initialized.');
        assert.end();
    }
});
// jscs:enable disallowKeywords

require('./count.js');
require('./count-nochannel.js');
require('./bmi-counter.js');
