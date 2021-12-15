#! /usr/bin/env node

// const importLocal = require("import-local");

// if (importLocal(__filename)) {
//   require("npmlog").info("cli", "正在使用 imooc-cli 本地版本");
// } else {
//   require("../lib")(process.argv.slice(2));
// }

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const pkj = require("../package.json");
const { argv } = require("yargs");
const arg = hideBin(process.argv);
const cli= yargs(arg)
const log = require("@dailycli-dev/log");

log()
const context = {
  cliVersion: pkj.version,
  cliName: pkj.name,
}
cli
  //command的第一种注册方式
  .command(
    "serve [port]",
    "启动服务",
    (yargs) => {
      //builder阶段 这里可以定义只在serve命令中才能使用的选项
      yargs.positional("port", {
        type: "number",
        describe: "端口号",
        default: 3000,
      });
    },
    (argv) => {
      //handler阶段 这里是具体执行serve命令的行为
      console.log("command: ", argv);
      console.info(`start server on ${argv.port}`);
      // serve(argv.port)
    }
  )
  //command的第二种注册方式
  .command({
    command: "list",
    aliases: ["ls"],
    describe: "列出所有命令",
    builder: (yargs) => {},
    handler: (argv) => {},
  })
  .usage("Usage: $0 <command> [options]")
  .demandCommand(1, "请输入命令")
  .recommendCommands()
  .strict()
  .alias("h", "help")
  .alias("v", "version")
  .wrap(cli.terminalWidth())
  .epilogue("更多信息请访问官网")
  .fail((msg, err, yargs) => {
    console.log("错误原因:", msg);
  })
  .options({
    debug: {
      type: "boolean",
      alias: "d",
      description: "调试模式",
      handler: (argv) => {},
    },
  })
  .option("registry", {
    type: "boolean",
    alias: "r",
    description: "注册组件",
    // hidden: true,
  })
  .group(["debug"], "开发模式的选项")
  .group(["registry"], "公共开发的选项")
  // .argv;
  .parse(process.argv.slice(2),context);    //参数的解析，用来替换