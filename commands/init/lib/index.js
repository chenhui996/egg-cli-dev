'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const Command = require('@egg-cli-2024/command')
const log = require('@egg-cli-2024/log');

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force);
    }

    async exec() {
        try {
            // 1. 准备阶段
            const ret = await this.prepare();

            if (ret) {
                // 2. 下载模板
                // 3. 安装模板
            }
        } catch (error) {
            log.error(error.message);
            if (process.env.LOG_LEVEL === 'verbose') {
                console.log(error);
            }
        }
    }

    async prepare() {
        // 1. 判断当前目录是否为空
        const localPath = process.cwd(); // 当前命令行执行命令的路径
        if (!this.isDirEmpty(localPath)) {
            let pass = false;
            // 询问是否创建
            if (!this.force) {
                const { isContinue } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'isContinue',
                    default: false,
                    message: '当前文件夹不为空，是否继续创建项目？'
                });

                if (!isContinue) {
                    return false;
                }

                pass = isContinue;
            }

            if (pass || this.force) {
                // 给用户做二次确认
                const { confirmDelete } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    default: false,
                    message: '是否确认清空当前目录下的文件？'
                });

                // 2. 是否启动强制更新
                if (confirmDelete) {
                    // 清空当前目录
                    fse.emptyDirSync(localPath);
                }
            }
        }
        return true;

        // 3. 选择创建或者取消
        // 4. 获取项目基本信息 
    }

    isDirEmpty(localPath) {
        let fileList = fs.readdirSync(localPath);
        fileList = fileList.filter(file => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0);
        return !fileList || fileList.length <= 0;
    }
}

function init(argv) {
    // console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}

module.exports.InitCommand = InitCommand;
module.exports = init;


