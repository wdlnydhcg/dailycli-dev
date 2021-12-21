/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-09 16:42:18
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-21 09:54:33
 * @Description:
 */
"use strict";
const path = require("path");
const os = require("os");
const userHome = os.homedir();
const fs = require("fs");
const log = require("@dailycli-dev/log");
const init = require("@dailycli-dev/init");
const exec = require("@dailycli-dev/exec");
const semver = require("semver");
const chalk = require("chalk");
const { Command } = require("commander");
const program = new Command();

const pkg = require("../package.json");


async function dailyCLI (argv) {
  //准备阶段  
  await prepare();
  //注册命令
  registerCommand();
}

function registerCommand () {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("[command] [options]")
    .version(pkg.version)
    .option("-d, --debug", "debug mode")
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件", "");
  program
    .command("init [projectName]")
    .description("初始化项目")
    // .argument("[projectName]", "project name")
    .option("-f, --force", "是否强制初始化项目")
    .action(exec);
  // 指定targetPath
  program.on("option:debug", function () {
    if (this.opts().debug) {
      process.env.LOG_LEVEl = 'verbose';
      console.log("debug mode");
    } else {
      process.env.LOG_LEVEl = "info";
      console.log("not debug mode");
    }
    console.log('set log level');
    log.level = process.env.LOG_LEVEl
  });
  // 加载指定包的路径targetPath
  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = this.opts().targetPath;
  });

  // 对未知命令监听
  program.on("command:*", (obj) => {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(chalk.red("未知的命令：" + obj[0]));
    if (availableCommands.length > 0) {
      console.log(chalk.green("可用命令：" + availableCommands.join(",")));
    }
  });
  program.parse(process.argv);
}

async function prepare () {
  //读取脚手架的icon文件和显示当前环境的信息
  // readIconAndCurInfo();
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

async function checkIsUpdate () {
  const curVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmInfo } = require("@dailycli-dev/get-npm-info");
  let data = await getNpmInfo(npmName);

  let latestVersion = data["dist-tags"].latest;
  if (latestVersion && semver.gt(latestVersion, curVersion)) {
    console.warn(
      `注意：${chalk.bgRed.white.bold("当前版本号 ")}${chalk.bgRed.white.bold(
        curVersion
      )} ${chalk.bgRed.white.bold("有新版本可用 ")}${chalk.bgRed.white.bold(
        latestVersion
      )} \n
      请手动更新 ${npmName} 包，更新命令为： npm install ${npmName}@lastest -g \n
      `
    );
  }
}

function checkArg () { }

function checkEnv () {
  const env = require("dotenv");
  const envPath = path.join(userHome, ".env");
  const dotenvPath = path.resolve(userHome, ".env");
  if (fs.existsSync(dotenvPath)) {
    let parse = env.config({ path: dotenvPath });
  }
  createDefaultConfig();
}

function createDefaultConfig () {
  const constant = require('./const');
  const cliConfig = {
    home: userHome,
  };

  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;    //当前cli插件在本地的home目录，一般是.dailycli的隐藏目录
}
function checkUserRoot () {
  const rootcheck = require("root-check");
  rootcheck();
}
function checkUserHome () {
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

function checkPkgVersion () {
  const version = pkg.version;
  // console.info(chalk.white.bgGray.bold("当前dailycli版本号为"), version);
}
function checkNodeVersion () {
  // console.info(chalk.white.bgGray.bold("当前node版本号为"), process.version);
}
//读取icon图标显示当前执行环境的信息
function readIconAndCurInfo () {
  let data = fs.readFileSync(path.join(__dirname, "./icon/icon.txt"), "utf8");
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
    `内存大小:${os.totalmem() / 1024 / 1024 / 1024}G`,
    `当前用户:${os.userInfo().username}`,
    `当前用户主目录:${os.homedir()}`,
    `当前进程ID:${process.pid}`,
    `当前进程名称:${process.title}`,
    `当前日期:${new Date().toLocaleString()}`,
  ].reverse();
  lines.forEach((line, lineNum) => {
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
