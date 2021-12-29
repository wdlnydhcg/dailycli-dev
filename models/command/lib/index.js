/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-23 09:21:36
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-29 09:41:22
 * @Description: 
 */
'use strict';

const LOWEST_NODE_VERSION = '12.0.0';
const log = require("@dailycli-dev/log")
const semver = require("semver")
class Command {
    constructor(argv){
        console.log('i am command constructor');
        let cmd = argv[argv.length - 1]
        let argvs = cmd.args;
        if (!argvs) {
            throw new Error('参数不能为空！');
        }
        if (!Array.isArray(argvs)) {
            throw new Error('参数必须为数组！');
        }
        if (argvs.length < 1) {
            throw new Error('参数列表为空！');
        }
        this._argv = argvs;
        this._cmd = cmd
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion());
            // chain = chain.then(() => this.initArgs());
            chain = chain.then(() => this.init());  //init是先调用子类实现的方法，如果子类没有，则执行父类的
            chain = chain.then(() => this.exec()); //init是先调用子类实现的方法，如果子类没有，则执行父类的
            chain.catch(err => {
                log.error(err.message);
            });
        });
    }
    // initArgs () {
    //     this._cmd = this._argv[this._argv.length - 1];
    //     this._argv = this._argv.slice(0, this._argv.length - 1);
    // }
    checkNodeVersion () {
        const currentVersion = process.version;
        const lowestVersion = LOWEST_NODE_VERSION;
        if (!semver.gte(currentVersion, lowestVersion)) {
            throw new Error(`imooc-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`);
        }
    }
    init(){
        throw new Error('init 必须实现');
    }
    exec(){
        throw new Error('exec 必须实现')
    }
}
module.exports = Command;