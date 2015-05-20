'use strict';

var document = require('global/document');
var hgrx = require('../index.js');
var hg = require('mercury');
var h = require('mercury').h;
var Rx = require('rx');
var extend = require('xtend');

function App() {
    var clicks = new Rx.Subject();

    return clicks.startWith({
        value: 0,
        channels: hgrx.subjectChannels({
            clicks: clicks
        })
    }).scan(function incrementCounter(state) {
        var newState = extend(state);
        newState.value = newState.value + 1;
        return newState;
    });
}

App.render = function render(state) {
    return h('div.counter', [
        'The state ', h('code', 'clickCount'),
        ' has value: ' + state.value + '.', h('input.button', {
            type: 'button',
            value: 'Click me!',
            'ev-click': hg.send(state.channels.clicks)
        })
    ]);
};

hgrx.app(hg, document.body, App(), App.render);
