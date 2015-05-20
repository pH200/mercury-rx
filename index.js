'use strict';
var extend = require('xtend');

function subjectChannels(channels) {
    var channelNames = Object.keys(channels);
    var newChannels = channelNames.reduce(function mapChannels(seed, name) {
        var subject = channels[name];
        if (subject && typeof subject.onNext === 'function') {
            seed[name] = function onEvent(data) {
                subject.onNext(data);
            };
        } else {
            seed[name] = subject;
        }
        return seed;
    }, {});
    return newChannels;
}

/*eslint max-params: 0*/
function app(mercury, elem, observable, render, opts) {
    if (!elem) {
        throw new Error(
            'Element does not exist. ' +
            'Mercury cannot be initialized.');
    }

    mercury.Delegator(opts);

    var loop;
    return observable.subscribe(function onNext(value) {
        if (loop) {
            loop.update(value);
        } else {
            loop = mercury.main(value, render, extend({
                diff: mercury.diff,
                create: mercury.create,
                patch: mercury.patch
            }, opts));
            elem.appendChild(loop.target);
        }
    });
}

module.exports = {
    app: app,
    subjectChannels: subjectChannels
};
