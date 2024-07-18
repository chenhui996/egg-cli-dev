'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// any -> .js

const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const pkg = require('../package.json');
const log = require('@egg-cli-2024/log');
const constant = require('./const');

let args;

// 检查参数
function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs(args);
}

// 检查参数，改变 log 级别
function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

// 检查用户主目录
function checkUserHome() {
    // console.log('userHome', userHome);
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

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
        checkUserHome();
        checkInputArgs();
        log.verbose('debug', 'test debug log');
    } catch (error) {
        log.error(error.message);
    }
}


