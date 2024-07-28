'use strict';

const Package = require('@egg-cli-2024/package');

function exec() {
    console.log(process.env.CLI_TARGET_PATH);
    console.log(process.env.CLI_HOME_PATH);
    console.log(process.env.CLI_HOME);

    const packageInstance = new Package();

    console.log(packageInstance.packageName);
}

module.exports = exec;