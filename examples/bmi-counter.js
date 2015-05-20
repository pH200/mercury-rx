'use strict';

var document = require('global/document');
var hg = require('mercury');
var h = hg.h;
var hgrx = require('../index.js');

var SafeHook = require('./lib/safe-hook.js');
var Rx = require('rx');
var ImMap = require('immutable').Map;

function App() {
    var heightChangeSubject = new Rx.Subject();
    var weightChangeSubject = new Rx.Subject();
    var bmiChangeSubject = new Rx.Subject();

    var startState = ImMap({
        height: 180,
        weight: 80,
        bmi: calcBmi(180, 80),
        channels: hgrx.subjectChannels({
            heightChange: heightChangeSubject,
            weightChange: weightChangeSubject,
            bmiChange: bmiChangeSubject
        })
    });
    return Rx.Observable.merge(
        heightChangeSubject.map(mapper('height')).map(updateData),
        weightChangeSubject.map(mapper('weight')).map(updateData),
        bmiChangeSubject.map(mapper('bmi')).map(updateData)
    ).startWith(startState)
    .scan(function scan(state, modifier) {
        return modifier(state);
    })
    .map(function tojs(state) {
        return state.toObject();
    });
}

function mapper(type) {
    return function pair(data) {
        return [type, data];
    };
}

function updateData(pair) {
    var type = pair[0];
    var data = pair[1];
    return function modifier(state) {
        var newState = state;
        newState = newState.set(type, Number(data.slider));
        var height = newState.get('height');
        var weight = newState.get('weight');
        var bmi = newState.get('bmi');
        if (type !== 'bmi') {
            newState = newState.set('bmi', calcBmi(height, weight));
        } else {
            newState = newState.set('weight', calcWeight(height, bmi));
        }
        return newState;
    };
}

function calcWeight(height, bmi) {
    var meterz = height / 100;
    return meterz * meterz * bmi;
}

function calcBmi(height, weight) {
    var meterz = height / 100;
    return weight / (meterz * meterz);
}

App.render = function render(state) {
    var channels = state.channels;
    var color = state.bmi < 18.5 ? 'orange' :
        state.bmi < 25 ? 'inherit' :
        state.bmi < 30 ? 'orange' : 'red';
    var diagnose = state.bmi < 18.5 ? 'underweight' :
        state.bmi < 25 ? 'normal' :
        state.bmi < 30 ? 'overweight' : 'obese';

    return h('div', [
        h('h3', 'BMI calculator'),
        h('div.weight', [
            'Weight: ' + ~~state.weight + 'kg',
            slider(state.weight, channels.weightChange, 30, 150)
        ]),
        h('div.height', [
            'Height: ' + ~~state.height + 'cm',
            slider(state.height, channels.heightChange, 100, 220)
        ]),
        h('div.bmi', [
            'BMI: ' + ~~state.bmi + ' ',
            h('span.diagnose', {
                style: {color: color}
            }, diagnose),
            slider(state.bmi, channels.bmiChange, 10, 50)
        ])
    ]);
};

function slider(value, channel, min, max) {
    return h('input.slider', {
        type: SafeHook('range'), // SafeHook for IE9 + type='range'
        min: min, max: max, value: String(value),
        style: {width: '100%'}, name: 'slider',
        'ev-event': hg.sendChange(channel)
    });
}

hgrx.app(hg, document.body, App(), App.render);
