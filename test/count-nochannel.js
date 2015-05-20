'use strict';

var test = require('tape');
var event = require('synthetic-dom-events');
var document = require('global/document');
var raf = require('raf');

if (typeof window === 'undefined') {
    require('./lib/load-hook.js');
}

var embedComponent = require('./lib/embed-component.js');
var count = require('../examples/count-nochannel.js');

test('count state is a number', function t(assert) {
    count.state.first().subscribe(function onNext(state) {
        assert.equal(typeof state, 'number');

        assert.end();
    });
});

test('count increments on click', function t(assert) {
    var comp = embedComponent(count);

    var button = document.getElementsByClassName('button')[0];

    button.dispatchEvent(event('click'));
    button.dispatchEvent(event('click'));

    assert.equal(comp.proxy.state, 2);

    raf(afterRender);

    function afterRender() {
        var elem = comp.target.childNodes[0].childNodes[2];

        assert.equal(elem.data, ' has value: 2.');

        comp.destroy();

        assert.end();
    }
});
