'use strict';

module.exports = core;

// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// any -> .js

const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const commander = require('commander');
const pkg = require('../package.json');
const log = require('@egg-cli-2024/log');
const init = require('@egg-cli-2024/init');
const exec = require('@egg-cli-2024/exec');
const constant = require('./const');

const program = new commander.Command();

// 注册脚手架命令
function registerCommand() {
    // 注册命令
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false) // 添加属性：debug，开启调试模式
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', ''); // 添加属性：targetPath，指定本地调试文件路径

    // 实现命令：init
    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec)

    // 实现 debug 属性：监听 debug，降低 log 级别`
    program.on('option:debug', function () {
        if (program.opts().debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
        log.verbose('debug', '已开始debug模式, npmlog level: verbose');
    });

    // 实现 targetPath 属性：监听 targetPath，设置环境变量
    program.on('option:targetPath', function () {
        process.env.CLI_TARGET_PATH = program.opts().targetPath;
    });

    // 对未知命令的监听
    program.on('command:*', (obj) => {
        // console.log('program', program);
        const availableCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red('未知命令：' + obj[0]));
        if (availableCommands.length > 0) {
            console.log(colors.red('可用命令：' + availableCommands.join(',')));
        }
    })

    program.parse(process.argv);
    // 当没有命令时，输出帮助信息
    if (program.args && program.args.length < 1) {
        program.outputHelp();
        console.log();
    }

}

// 检查全局更新
async function checkGlobalUpdate() {
    // 1. 获取当前版本号
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 2. 调用 npm API，获取所有版本号
    // 3. 提取所有版本号，比对哪些版本号是大于当前版本号
    // 4. 获取最新版本号，提示用户更新到最新版本
    const { getNpmSemverVersion } = require("@egg-cli-2024/get-npm-info");
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName);

    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn('更新提示', colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
更新命令：npm install -g ${npmName}`));
    }
}

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath,
        });
    };

    createDefaultConfig();
}

// 创建默认配置
function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    };
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

// 检查用户主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

// 检查 root 账户
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
}

// 检查 Node 版本
function checkNodeVersion() {
    // 第一步，获取当前 Node 版本
    const currentVersion = process.version;
    // 第二步，获取最低 Node 版本
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    // 第三步，比对当前版本和最低版本
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`egg-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    } else {
        log.info('cli', `Node.js 版本检查通过, 当前版本：${currentVersion}`);
    }
}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', pkg.version);
}

// 准备阶段
async function prepare() {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
}


// 主函数
async function core() {
    try {
        await prepare();
        registerCommand();
    } catch (error) {
        log.error(error.message);
    }
}


