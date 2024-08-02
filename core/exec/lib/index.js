'use strict';

const Package = require('@egg-cli-2024/package');
const log = require('@egg-cli-2024/log');

const SETTINGS = {
    init: '@egg-cli-2024/init'
};

function exec() {
    let targetPath = process.env.CLI_TARGET_PATH;
    log.verbose('targetPath', targetPath);

    if (!targetPath) {
        targetPath = process.env.CLI_HOME_PATH;
    }

    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];

    const packageInstance = new Package({
        targetPath,
        packageName,
        packageVersion: 'latest'
    });

    console.log(packageInstance.getRootFilePath());
}

module.exports = exec;