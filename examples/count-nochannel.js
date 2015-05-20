'use strict';

var document = require('global/document');
var hgrx = require('../index.js');
var hg = require('mercury');
var h = require('mercury').h;
var Rx = require('rx');

var clicks = new Rx.Subject();
clicks.onEvent = clicks.onNext.bind(clicks);

function App() {
    return clicks.startWith(0)
        .scan(function incrementCounter(state) {
            return state + 1;
        });
}

App.render = function render(state) {
    return h('div.counter', [
        'The state ', h('code', 'clickCount'),
        ' has value: ' + state + '.', h('input.button', {
            type: 'button',
            value: 'Click me!',
            'ev-click': hg.send(clicks.onEvent)
        })
    ]);
};

hgrx.app(hg, document.body, App(), App.render);
