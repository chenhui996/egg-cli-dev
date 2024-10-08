'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const semver = require('semver');
const Command = require('@egg-cli-2024/command')
const log = require('@egg-cli-2024/log');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
    // constructor 做初始化工作
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force);
    }

    // 核心执行逻辑
    async exec() {
        try {
            // 1. 准备阶段
            const projectInfo = await this.prepare();

            if (projectInfo) {
                // 2. 下载模板
                log.verbose('projectInfo', projectInfo);
                this.downloadTemplate();
                // 3. 安装模板
            }
        } catch (error) {
            log.error(error.message);
            if (process.env.LOG_LEVEL === 'verbose') {
                console.log(error);
            }
        }
    }

    downloadTemplate() {
        // 1. 通过项目模板API获取项目模板信息
        // 1.1 通过egg.js搭建一套后端系统
        // 1.2 通过npm存储项目模板
        // 1.3 将项目模板信息存储到mongodb数据库中
        // 1.4 通过egg.js获取mongodb中的数据并通过API返回
    }

    // 准备阶段
    async prepare() {
        // 1. 判断当前目录是否为空
        const localPath = process.cwd(); // 当前命令行执行命令的路径

        // 处理文件夹相关
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
                    return;
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

        return await this.getProjectInfo(); // 获取项目基本信息
    }

    // 获取项目基本信息
    async getProjectInfo() {
        let projectInfo = {};
        // 1. 选择创建或者取消
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [
                { name: '项目', value: TYPE_PROJECT },
                { name: '组件', value: TYPE_COMPONENT }
            ]
        }); // 选择创建项目或者组件

        // 获取 项目 基本信息 
        if (type === TYPE_PROJECT) {
            const project = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称',
                    default: '',
                    validate: function (v) {
                        const done = this.async();

                        setTimeout(function () {
                            // 1.首字符为英文字符
                            // 2.尾字符为英文或数字，不能为字符
                            // 3.字符仅允许"-_"
                            const pass = /^[a-zA-z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)

                            if (!pass) {
                                done('请输入合法的项目名称');
                                return;
                            }
                            done(null, true);
                        }, 0);
                    }, // 控制输入的值
                    filter: function (v) {
                        return v;
                    } // 对输入的值做 format
                },
                {
                    type: 'input',
                    name: 'projectVersion',
                    message: '请输入项目版本号',
                    default: '1.0.0',
                    validate: function (v) {
                        const done = this.async();

                        setTimeout(function () {
                            const pass = !!semver.valid(v);

                            if (!pass) {
                                done('请输入合法的版本号');
                                return;
                            }
                            done(null, true);
                        }, 0);
                    },
                    filter: function (v) {
                        return semver.valid(v) ? semver.valid(v) : '';
                    }
                },
                {
                    type: 'list',
                    name: 'projectTemplate',
                    message: '请选择项目模板',
                    choices: [
                        { name: 'Vue', value: 'vue' },
                        { name: 'React', value: 'react' }
                    ]
                }
            ]);

            projectInfo = {
                type,
                ...project
            }

        } else if (type === TYPE_COMPONENT) {
            // 获取 组件 基本信息
        }

        return projectInfo;
    }

    // 判断当前目录是否为空
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


