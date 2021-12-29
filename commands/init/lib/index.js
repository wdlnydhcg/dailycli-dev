/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-16 20:13:07
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-29 10:46:55
 * @Description:
 */
"use strict";
const Command = require("@dailycli-dev/command");
const { loadingStart } = require("@dailycli-dev/utils");
const fs = require("fs");
const semver = require("semver");
const inquirer = require("inquirer");
const log = require("@dailycli-dev/log");
const tempData = require('./getProjectTemplate')
class InitCommand extends Command {
    
    init () {
        this.projectName = this._argv[0] || "";
        this.force = !!this._cmd._optionValues.force;
        console.log("i am initCommand init", this._argv);
    }
    exec () {
        console.log("i am initCommand exec");
        //1. 准备阶段
        this.prepare();
        //2. 下载模板
        //3. 安装模板
    }
    /**
     * 初始化前的准备阶段
     * 1. 判断项目模板是否存在，以前是否下载过
     * 2. 判断当前目录是否为空
     * 详细设计在 https://www.yuque.com/xifuneisi/eduz7i/skw2i0#ZdUIf
     */
    async prepare () {
        const localPath = process.cwd();
        console.log("localPath", localPath);

        let ifContinue = false;
        if (!this.isEmptyDir(localPath) || true) {
            const { project_type } = await inquirer.prompt({
                type: "list", 
                name: "project_type",
                message: "🍊请选择项目的类型",
                choices: [
                    { value: 1, name: "项目" },
                    { value: 2, name: "组件" },
                ],
            });
            const { tech_type } = await inquirer.prompt({
                type: "list",
                name: "tech_type",
                message: "🍊选择项目技术栈",
                choices: [
                    { value: 'vue2标准模板', name: "vue2标准模板" },
                    { value: "vue3标准模板", name: "vue3标准模板" },
                ],
            });
            const { project_name } = await inquirer.prompt({
                type: "input", //输入的input字符串
                name: "project_name", //answer的key
                message: "🍊请输入项目的名称", //label
                validate:function(v){
                    const done = this.async();
                    setTimeout(function () {
                        const reg = /^[a-zA-Z]+([-][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/; //正则表达式
                         
                        if (!(reg.test(v))) {
                            done('请输入合法的项目名称');
                            return;
                        }
                        done(null, true);
                    }, 0);
                    
                },
                transformer: function (v) {					//类似于placeholder
                    return v + '    (格式参考:platform-module-mgr,component-button用-分割)';
                },
            });
            const { project_version } = await inquirer.prompt({
                type: "input", //输入的input字符串
                name: "project_version", //answer的key
                message: "🍊请输入项目的版本号", //label
                default: "1.0.0",
                validate: function(v){
                    const done = this.async();
                    setTimeout(function () {
                        if (!(!!semver.valid(v))) {
                            done('请输入合法的版本号');
                            return;
                        }
                        done(null, true);
                    }, 0);
                }
            });
            
            this.projectInfo = {
                project_type,
                tech_type,
                project_name,
                project_version
            };;
            console.log("projectInfo", this.projectInfo);
            this.downloadTemplate();
            // let loading = loadingStart("正在安装模板...");
            // setTimeout(() => {
            //     loading.stop();
            //     loading.succeed('安装成功');
            //     // loading.fail('安装成功');
            //     // loading.warn('安装成功');
            //     // loading.info('安装成功');
             
            // }, 1000);
        }
    }

    downloadTemplate(){
        console.log("开始下载模板", tempData);
        if (!tempData || tempData.length <= 0){
            throw new Error("项目模板不存在");
        }
        let { npm, npmName, version} = tempData.find(item => { item.name === this.projectInfo.tech_type});
        
    }
    //判断目录是否为空
    isEmptyDir (path) {
        let fileList = fs.readdirSync(path);
        // // 文件过滤的逻辑
        // fileList = fileList.filter(file => (
        //     !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        // ));
        return !fileList || fileList.length <= 0;
    }
}

function init (argv) {
    return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
