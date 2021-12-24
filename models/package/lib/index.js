/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-17 15:13:00
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-23 17:04:46
 * @Description:
 */
"use strict";
const { isObject } = require("@dailycli-dev/utils");
const { getDefaultRegistry,getNpmLatestVersion } = require('@dailycli-dev/get-npm-info');
const npminstall = require("npminstall")
const formatPath = require("@dailycli-dev/format-path");
const pathExists = require("path-exists").sync;
const fse = require("fs-extra");
const pkgDir = require("pkg-dir").sync;
const path = require("path");
class Package {
    constructor(options) {
        console.log("I am package class");
        if (!options) {
            throw new Error("Package类的构造函数必须传入参数");
        }
        if (!isObject(options)) {
            throw new Error("Package类的构造函数参数必须为对象");
        }
        //package的路径
        this.targetPath = options?.targetPath;
        //package的依赖存储路径 targetPath/node_modules
        this.storePath = options?.storePath;
        //package的名称
        this.packageName = options?.packageName;
        //package的版本
        this.packageVersion = options?.packageVersion; 
        // package的缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_');
    }

    get cacheFilePath () {
        return path.resolve(this.storePath, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
    }
    getSpecificCacheFilePath(packageVersion){
        return path.resolve(this.storePath,`_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);

    }
    //准备工作
    //判断缓存依赖的路径存在，没有就创建
    //判断是否是要最新的包，是的话，就去拉去最新的包
    async prepare(){
        //判断包存储路径是否存在，不存在则创建
        if (this.storePath && !pathExists(this.storePath)){
            fse.mkdirpSync(this.storePath);     //mkdirp是创建一个路径，如果中间没有某个文件夹，则也创建
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName);
        }
    }

    //判断当前package是否存在
    async exists () {
        if (this.storePath){
            await this.prepare();
            return pathExists(this.cacheFilePath);
        }else{
            return pathExists(this.targetPath);
        }
    }

    //安装package
    async install () { 
        await this.prepare();
        await npminstall({
            root: this.targetPath,
            storeDir: this.storePath,
            register: getDefaultRegistry(),
            pkgs: [{
                name: this.packageName,
                version: this.packageVersion,
            }],
        })
    }

    //更新package
    async update () {
        await this.prepare()
        // 1. 获取最新的npm模块版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName);
        // 2. 查询最新版本号对应的路径是否存在
        const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
        // 3. 如果不存在，则直接安装最新版本
        if (!pathExists(latestFilePath)){
            return npminstall({
                root: this.targetPath,
                storeDir: this.storePath,
                register: getDefaultRegistry(),
                pkgs: [{
                    name: this.packageName,
                    version: latestPackageVersion,
                }],
            })
        }
        // return latestFilePath
    }

    //获取入口文件路径
    getRootFilePath () {
        function _getRootFile (targetPath){
            //1. 先获取package.json所在的目录
            const dir = pkgDir(targetPath);
            if (dir) {
                //2. 读取package.json
                const pkgFile = require(path.join(dir, "package.json"));
                //3.寻找main字段，入口文件
                if (pkgFile && pkgFile.main) {
                    //4. 路径兼容(mac，win)
                    return formatPath(path.resolve(dir, pkgFile.main));
                }
            }
            return null
        }
        if (this.storePath) {
            return _getRootFile(this.cacheFilePath)
        }else{
            return _getRootFile(this.targetPath)
        }
    }
}
module.exports = Package;
