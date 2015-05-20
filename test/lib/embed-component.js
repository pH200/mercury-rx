'use strict';

var document = require('global/document');

var mercury = require('mercury');
var hgrx = require('../../index.js');

module.exports = embedComponent;

function embedComponent(component, onNext) {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var proxy = {};
    function tapProxy(value) {
        proxy.state = value;
    }

    var remove = hgrx.app(
        mercury,
        div,
        component.state.tap(tapProxy),
        component.render
    );

    return {
        destroy: destroy,
        state: component.state,
        render: component.render,
        target: div,
        proxy: proxy
    };

    function destroy() {
        document.body.removeChild(div);
        remove.dispose();
    }
}
