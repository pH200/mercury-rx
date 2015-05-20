'use strict';

var callify = require('callify');

module.exports = callify({
    '../index.js': function transformNode(node, params) {
        if (params.file.indexOf('test') !== -1) {
            return;
        }

        if (params.calls[0] === 'hgrx' &&
            params.calls[1] === 'app'
        ) {
            node.update(replacer(node));
        }
    }
});

function replacer(node) {
    return 'module.exports = {\n' +
        '    state: ' + node.arguments[2].source() + ',\n' +
        '    render: ' + node.arguments[3].source() + '\n' +
        '}';
}
