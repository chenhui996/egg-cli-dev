'use strict';

const semver = require('semver');
const colors = require('colors/safe');
const log = require('@egg-cli-2024/log');

const LOWEST_NODE_VERSION = '12.0.0';

class Command {
    constructor(argv) {
        if (!argv) {
            throw new Error('参数不能为空');
        }

        if (!Array.isArray(argv)) {
            throw new Error('参数必须为数组');
        }

        if (argv.length < 1) {
            throw new Error('参数列表为空');
        }

        this._argv = argv;
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion());
            chain = chain.then(() => this.initArgs());
            chain = chain.then(() => this.init());
            chain = chain.then(() => this.exec());
            chain.then(resolve).catch(reject);
        });

        runner.then(() => {
            console.log('执行成功');
        }).catch(err => {
            log.error(err.message);
        });
    }

    initArgs() {
        this._cmd = this._argv[this._argv.length - 1];
        this._argv = this._argv.slice(0, this._argv.length - 1);
    }

    // 检查 Node 版本
    checkNodeVersion() {
        // 第一步，获取当前 Node 版本
        const currentVersion = process.version;
        // 第二步，获取最低 Node 版本
        const lowestVersion = LOWEST_NODE_VERSION;
        // 第三步，比对当前版本和最低版本
        if (!semver.gte(currentVersion, lowestVersion)) {
            throw new Error(colors.red(`egg-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
        } else {
            log.info('cli', `Node.js 版本检查通过, 当前版本：${currentVersion}`);
        }
    }

    init() {
        throw new Error('init 必须实现');
    }

    exec() {
        throw new Error('exec 必须实现');
    }
}

module.exports = Command;