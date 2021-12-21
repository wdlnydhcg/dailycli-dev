/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-17 15:13:00
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-21 14:44:04
 * @Description:
 */
"use strict";
const { isObject } = require("@dailycli-dev/utils");
const { getNpmLatestVersion } = require('@dailycli-dev/get-npm-info');
const formatPath = require("@dailycli-dev/format-path");
const pathExists = require("path-exists").sync;
const fse = require("fs-extra");
const pkgDir = require("pkg-dir");
const path = require("path");
class Package {
    constructor(options) {
        console.log("I am package class");
        if (!options ) {
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
    //准备工作
    //判断缓存依赖的路径存在，没有就创建
    //判断是否是要最新的包，是的话，就去拉去最新的包
    async prepare(){
        //判断包存储路径是否存在，不存在则创建
        if (this.storePath && !pathExists(this.storePath)){
            fse.mkdirpSync(this.storePath);
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName);
        }
        // console.log("prepare     ",await this.getRootFilePath());
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
    install () { 
        
    }

    //更新package
    update () { }

    //获取入口文件路径
    async getRootFilePath () {
        //1. 先获取package.json所在的目录
        const dir = await pkgDir(this.targetPath);
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
        // function _getRootFile(targetPath){
        //     //1. 先获取package.json所在的目录
        //     const dir = pkgDir(this.targetPath);
        //     if (dir) {
        //         //2. 读取package.json
        //         const pkgFile = require(path.join(dir, "package.json"));
        //         //3.寻找main字段，入口文件
        //         if (pkgFile && pkgFile.main) {
        //             //4. 路径兼容(mac，win)
        //             return formatPath(path.resolve(dir, pkgFile.main));
        //         }
        //     }
        //     return null
        // }
        // if (this.storePath) {
        //     return _getRootFile(this.cacheFilePath);
        // } else {
        //     return _getRootFile(this.targetPath);
        // }
    }
}
module.exports = Package;
