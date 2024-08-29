'use strict';

const Command = require('@egg-cli-2024/command')

class InitCommand extends Command {}

function init(argv) {
    // console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}

module.exports.InitCommand = InitCommand;
module.exports = init;


