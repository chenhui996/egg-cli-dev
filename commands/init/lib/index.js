'use strict';

function init(projectName, cmdObj) {
    console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH);
    // require(path.resolve(__dirname, '../lib/init.js'))(projectName, cmdObj);
}

module.exports = init;
