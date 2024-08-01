'use strict';

const { isObject } = require('@egg-cli-2024/utils');

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
        // package 的缓存路径
        this.storePath = options.storePath;
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
    }
}

module.exports = Package;
