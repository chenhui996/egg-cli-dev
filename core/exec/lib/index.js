'use strict';

const Package = require('@egg-cli-2024/package');
const log = require('@egg-cli-2024/log');

const SETTINGS = {
    init: '@egg-cli-2024/init'
};

function exec() {
    // console.log(process.env.CLI_TARGET_PATH);
    // console.log(process.env.CLI_HOME_PATH);
    // console.log(process.env.CLI_HOME);
    const targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);

    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    console.log(cmdName);
    const packageName = SETTINGS[cmdName];

    const packageInstance = new Package({
        targetPath,
        storePath: homePath,
        packageName,
        packageVersion: 'latest'
    });

    console.log(packageInstance);
}

module.exports = exec;