'use strict';

const fs = require('fs');
const Command = require('@egg-cli-2024/command')
const log = require('@egg-cli-2024/log');

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force);
    }

    exec() {
        try {
            // 1. 准备阶段
            this.prepare();
            // 2. 下载模板
            // 3. 安装模板
        } catch (error) {
            log.error(error.message);
            if (process.env.LOG_LEVEL === 'verbose') {
                console.log(error);
            }
        }
    }

    prepare() {
        // 1. 判断当前目录是否为空
        // 2. 是否启动强制更新
        // 3. 选择创建或者取消
        // 4. 获取项目基本信息 
    }
}

function init(argv) {
    // console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}

module.exports.InitCommand = InitCommand;
module.exports = init;


