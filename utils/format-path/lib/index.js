'use strict';

const path = require('path');

module.exports = function (p) {
    if (p && typeof p === 'string') {
        const sep = path.sep;
        if (sep === '/') {
            // mac/linux
            return p;
        } else {
            // windows 需将反斜杠转换为正斜杠
            return p.replace(/\\/g, '/');
        }
    }
}


