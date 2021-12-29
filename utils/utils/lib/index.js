/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-09 15:51:38
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-28 16:26:51
 * @Description: 
 */
'use strict';

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function spinnerStart (msg, spinnerString = '|/-\\') {
  const Spinner = require('cli-spinner').Spinner;
  const spinner = new Spinner(msg + ' %s');
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
}

function sleep (timeout = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

//异步执行命令，返回子命令
function exec (command, args, options) {
  const win32 = process.platform === 'win32';

  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;

  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

function execAsync (command, args, options) {
  return new Promise((resolve, reject) => {
    const p = exec(command, args, options);
    p.on('error', e => {
      reject(e);
    });
    p.on('exit', c => {
      resolve(c);
    });
  });
}

function loadingStart(loadingString = '执行中,请稍等'){
  const ora = require('ora');
  const loading = ora(loadingString).start();
  loading.spinner = "soccerHeader"
  return loading;
}

module.exports = {
  loadingStart,
  isObject,
  spinnerStart,
  sleep,
  exec,
  execAsync,
};