'use strict';

const path = require('path');
const Package = require('@egg-cli-2024/package');
const log = require('@egg-cli-2024/log');

const SETTINGS = {
    // init: '@egg-cli-2024/init'
    init: '@imooc-cli/init'
};

const CACHE_DIR = 'dependencies';

async function exec() {
    // console.log(process.env);
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    let storeDir = '';
    let pkg;
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR);
        storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);

        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion: 'latest'
        });

        if (await pkg.exists()) {
            // 更新package
            const rootFile = pkg.getRootFilePath();
            if (rootFile) {
                pkg.update();
            }
        } else {
            // 安装package
            await pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion: 'latest'
        })
    }

    const rootFile = pkg.getRootFilePath();
    if (rootFile) {
        require(rootFile).apply(null, arguments);
    }

    // console.log(pkg.getRootFilePath());
}

module.exports = exec;