/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-09 16:42:18
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-12 09:05:16
 * @Description: 
 */
'use strict';

module.exports = dailyCLI;
const pkg = require('../package.json');

function dailyCLI(argv) {
  console.log("argv", argv);
  checkPkgVersion();
//   console.log("yargs", yargs);
//   console.log("yargsArgv ", yargsArgv);

}

function checkPkgVersion(){
      console.log("checkPkgVersion",pkg.version);
};
