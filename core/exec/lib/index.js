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
    const packageVersion = 'latest';

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR);
        storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath);
        log.verbose('storeDir', storeDir);

        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        });

        if (await pkg.exists()) {
            // 更新package
            await pkg.update();
        } else {
            // 安装package
            await pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        })
    }

    const rootFile = pkg.getRootFilePath(); // 已经是一个 js 文件的可执行路径了

    if (rootFile) {
        require(rootFile).apply(null, arguments);
        // 本行代码解释：require(rootFile)返回的是一个函数，然后调用这个函数
        // rootFile 传入的是一个文件路径，这个文件路径是一个js文件，这个js文件是一个模坩，这个模坩导出了一个函数
        // 所以这行代码的意思是：调用这个模坩导出的函数，并传入arguments
    }
}

module.exports = exec;