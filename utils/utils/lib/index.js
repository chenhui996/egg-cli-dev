'use strict';



function utils() {
    // TODO
    console.log('utils');
}

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};

module.exports = { utils, isObject };
