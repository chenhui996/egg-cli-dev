'use strict';

const path = require('path');
const pkgDir = require('pkg-dir');
const { isObject } = require('@egg-cli-2024/utils');
const formatPath = require('@egg-cli-2024/format-path');

class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package类的options参数不能为空');
        }
        if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象');
        }
        // package 的路径
        this.targetPath = options.targetPath;
        // package 的 name
        this.packageName = options.packageName;
        // package 的 version
        this.packageVersion = options.packageVersion;
    }

    // 判断当前Package是否存在
    exists() {
        console.log('Package exists');
    }

    // 安装Package
    install() {
        console.log('Package install');
    }

    // 更新Package
    update() {
        console.log('Package update');
    }

    // 获取入口文件的路径
    getRootFilePath() {
        console.log('Package getRootFilePath');
        const dir = pkgDir.sync(this.targetPath);
        if (dir) {
            // 获取package.json所在的目录
            const pkgFile = require(path.resolve(dir, 'package.json'));
            if (pkgFile && pkgFile.main) {
                // 路径的兼容（macOS/windows）
                return formatPath(path.resolve(dir, pkgFile.main));
            }
        }
        return null;
    }
}

module.exports = Package;
