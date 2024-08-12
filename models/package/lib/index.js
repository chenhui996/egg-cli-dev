'use strict';

const fse = require('fs-extra');
const path = require('path');
const pkgDir = require('pkg-dir');
const pathExists = require('path-exists').sync;
const { isObject } = require('@egg-cli-2024/utils');
const formatPath = require('@egg-cli-2024/format-path');
const npminstall = require('npminstall');
const { getDefaultRegistry, getNpmLatestVersion } = require('@egg-cli-2024/get-npm-info');

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
        this.storeDir = options.storeDir;
        // package 的 name
        this.packageName = options.packageName;
        // package 的 version
        this.packageVersion = options.packageVersion;
        // package 的缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_');
    }

    // 准备
    async prepare() {
        if (this.storeDir && !pathExists(this.storeDir)) {
            console.log('this.storeDir', this.storeDir);
            fse.mkdirpSync(this.storeDir);
        }

        if (this.packageVersion === 'latest') {
            console.log('this.packageVersion', this.packageVersion);
            this.packageVersion = await getNpmLatestVersion(this.packageName); // 获取最新版本号
        }
        // console.log('prepare', this.packageName, this.packageVersion, await getNpmLatestVersion(this.packageName));
    }

    get cacheFilePath() {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
        // 为什么是按这个格式来命名？
        // 因为这个格式是npm的缓存目录的命名规则， npminsall 下载的包也会按这个规则来命名
        // 所以我们是在做一个兼容，如果我们的包和npm下载的包放在一起，那么我们的包也会被npm识别
    }

    // 判断当前Package是否存在
    async exists() {
        console.log('Package exists');
        if (this.storeDir) {
            await this.prepare();
            console.log('this.cacheFilePath', this.cacheFilePath);
            return pathExists(this.cacheFilePath);
        } else {
            return pathExists(this.targetPath); // 什么时候会进入此分支？ 本地调试时，不需要缓存，直接使用本地的包
        }
    }

    // 安装Package
    async install() {
        console.log('Package install');
        // await this.prepare();
        return npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: getDefaultRegistry(),
            pkgs: [
                { name: this.packageName, version: this.packageVersion }
            ]
        });
    }

    getSpecificCacheFilePath(packageVersion) {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
    }

    // 更新Package
    async update() {
        console.log('Package update');
        await this.prepare();
        // 1. 获取最新的npm模块版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName);
        // 2. 查询最新版本号对应的路径是否存在
        const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
        // 3. 如果不存在，则直接安装最新版本
        if (!pathExists(latestFilePath)) {
            await npminstall({
                root: this.targetPath,
                storeDir: this.storeDir,
                registry: getDefaultRegistry(),
                pkgs: [
                    { name: this.packageName, version: latestPackageVersion }
                ]
            });
            this.packageVersion = latestPackageVersion
        }
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
