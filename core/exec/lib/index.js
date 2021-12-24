/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-17 10:24:23
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-24 14:34:16
 * @Description:
 */
"use strict";
const path = require("path");
const Package = require("@dailycli-dev/package");
const log = require("@dailycli-dev/log");
const SETTINGS = {  //默认的包
    init: '@dailycli-dev/init'
};
const CACHE_DIR = 'dependencies';       //下载的缓存路径
//动态加载init包
//解析命令行参数，因为是挂在init命令的action上，所以需要判断 init 执行的包是哪个包。
//默认是自己的，如果有参数，则加载参数的包
async function exec () {
    let targetPath = process.env.CLI_TARGET_PATH;     //如果是本地的调试，则指定调试的目录
    const homePath = process.env.CLI_HOME_PATH;     //如果是本地的调试，则指定调试的目录
    log.verbose("targetPath", targetPath);
    log.verbose("homePath", homePath);
    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name();          //命令名称
    const packageName = SETTINGS[cmdName];      //获取包名
    const packageVersion = "latest";               //版本号
    let pkg,
        storePath;
    if(!targetPath){        //如果不指定加载的包，则使用默认的init包
        targetPath = path.resolve(homePath, CACHE_DIR);     //使用缓存路径 /user/zhangsan/.dailycli-dev/dependencies
        storePath = path.resolve(targetPath, 'node_modules'); // /user/zhangsan/.dailycli-dev/dependencies/node_modules
        log.verbose("targetPath", targetPath);
        log.verbose("storePath", storePath);
        pkg = new Package({
            targetPath,     //包的路径
            storePath,       //包的存储路径
            packageName,
            packageVersion
        });
        
        if (await pkg.exists()) {
            //更新package
            pkg.update();
        } else {
            //安装package
            pkg.install();
        }
    }else{
        pkg = new Package({
            targetPath,     //包的路径
            packageName,
            packageVersion,
        });
    }
    //获取指定的包的入口文件
    const rootFile =  await pkg.getRootFilePath()
    console.log("pkg", pkg);
    if(rootFile){
        try{
            const args = Array.from(arguments);
            // 在当前进程中调用
            require(rootFile).call(null, args);   //这里用apply，方便参数的格式转换
        }catch(err){
            log.error(err.message)
        }
    }
    //运行指定的包
    
    //1. 将targetPath认为是modulePath
    //2. 将modulePath认为是package(npm模块)
    //3. 将package.getRootFile(获取入口文件)
    //4. package.update / package.install
}

module.exports = exec;
