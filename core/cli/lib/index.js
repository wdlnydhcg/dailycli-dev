/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-09 16:42:18
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-16 16:16:04
 * @Description: 
 */
'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const log = require('@dailycli-dev/log');
const semver =require("semver");
const { program } = require("commander");
const pkg = require('../package.json');
const minimist = require("minimist");
const chalk = require("chalk");
const userHome = os.homedir();
async function dailyCLI(argv) {
  // console.log("argv", argv);
  await prepare();

}

/**
 * 准备阶段

 * */

async function prepare(){
  log.success('预准备开始');
  //读取脚手架的icon文件和显示当前环境的信息
  readIconAndCurInfo();
  // 1. 检查版本号
  checkPkgVersion();
  // 2. 检查node版本
  checkNodeVersion();
  // 3. 检查root启动
  checkUserRoot();
  // 4. 检查用户主目录
  checkUserHome();
  // 5. 检查入参
  checkArg();
  // 6. 检查环境变量
  checkEnv();
  // 7. 检查是否为最新版本
  checkIsUpdate();

}
async function checkIsUpdate(){
  const curVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmInfo } = require("@dailycli-dev/get-npm-info");
  let data = await getNpmInfo(npmName)

  let latestVersion = data["dist-tags"].latest;
  if (latestVersion && semver.gt(latestVersion,curVersion)) {
    console.warn(
      `注意：${chalk.bgRed.white.bold(
        "当前版本号 "
      )}${chalk.bgRed.white.bold(curVersion)} ${chalk.bgRed.white.bold(
        "有新版本可用 "
      )}${chalk.bgRed.white.bold(latestVersion)} \n
      请手动更新 ${npmName} 包，更新命令为： npm install ${npmName}@lastest -g \n
      `
    );
  }
};

function checkArg(){
  
}

function checkEnv(){
  const env = require("dotenv");
  const envPath = path.join(userHome, ".env");
  const dotenvPath = path.resolve(userHome, ".env");
  if (fs.existsSync(dotenvPath)) {
    let parse = env.config({ path: dotenvPath });
  }
  initDefaultEnv();
}
function initDefaultEnv(){
  const defaultConfig = {
    username: 'root',
  }
  process.env.username = process.env.username ? process.env.username:defaultConfig.username;
}
function checkUserRoot(){
  const rootcheck = require("root-check");
  rootcheck();
}
function checkUserHome(){
 if (!userHome || !fs.existsSync(userHome)) {
  throw new Error(colors.red("当前登录用户主目录不存在！"));
 }
}

function checkPkgVersion(){
  const version = pkg.version;
  // console.info(chalk.white.bgGray.bold("当前dailycli版本号为"), version);
};
function checkNodeVersion(){
  // console.info(chalk.white.bgGray.bold("当前node版本号为"), process.version);
}
//读取icon图标显示当前执行环境的信息
function readIconAndCurInfo(){
  let data = fs.readFileSync(path.resolve(__dirname, "../icon/icon.txt"),"utf8",);  
  const lines = data.split(/\r?\n/);
  let InfoList = [
    `CLI Author: MrAlenZhong`,
    `【当前环境信息】`,
    `脚手架版本:${pkg.version}`,
    `Node环境版本:${process.version}`,
    `系统环境:${os.platform()}`,
    `系统版本:${os.release()}`,
    `CPU架构:${os.arch()}`,
    `CPU数量:${os.cpus().length}`,
    `内存大小:${os.totalmem()/1024/1024/1024}G`,
    `当前用户:${os.userInfo().username}`,
    `当前用户主目录:${os.homedir()}`,
    `当前进程ID:${process.pid}`,
    `当前进程名称:${process.title}`,
    `当前日期:${new Date().toLocaleString()}`,
  ].reverse();
  lines.forEach((line,lineNum) => {
    if (lines.length - InfoList.length <= lineNum) {
      if (lines.length - 1 - lineNum === InfoList.length - 1) {
        console.info(
          `${line} ${chalk.bgCyan.white.bold(
            InfoList[lines.length - 1 - lineNum]
          )}`
        );
      } else {
        console.info(`${line} ${InfoList[lines.length - 1 - lineNum]}`);
      }
    } else {
      console.info(`${line} `);
    }
  });
}
module.exports = dailyCLI;
