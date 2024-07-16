'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// any -> .js
const pkg = require('../package.json');
const log = require('@egg-cli-2024/log');

function core() {
    checkPkgVersion();
}

// 检查版本号
function checkPkgVersion() {
    console.log(pkg.version);
    log.info('cli', pkg.version);
}
