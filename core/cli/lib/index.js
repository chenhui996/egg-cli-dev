'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// any -> .js

const semver = require('semver');
const colors = require('colors/safe');
const pkg = require('../package.json');
const log = require('@egg-cli-2024/log');
const constant = require('./const');

// 检查 root 账户
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
    // console.log('rootCheck', process.getuid());
}

// 检查 Node 版本
function checkNodeVersion() {
    // 第一步，获取当前 Node 版本
    const currentVersion = process.version;
    // 第二步，获取最低 Node 版本
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    // 第三步，比对当前版本和最低版本
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`egg-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    } else {
        log.info('cli', `Node.js 版本检查通过, 当前版本：${currentVersion}`);
    }
}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', pkg.version);
}

// 主函数
function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
    } catch (error) {
        log.error(error.message);
    }
}


