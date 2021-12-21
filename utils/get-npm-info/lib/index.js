/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-16 14:16:58
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-21 14:38:39
 * @Description:
 */
"use strict";
const axios = require("axios");
const semver = require("semver");
const path = require("path");
const chalk = require("chalk");
//远程获取包的所有信息
async function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  let url = path.join(registryUrl, npmName);
  return await axios
    .get(`${registryUrl}/${npmName}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
        console.info(
          chalk.bgRed.white.bold(
            `检查包版本时 获取包 ${npmName} 信息失败，查询路径${registryUrl}/${npmName}`
          )
        );
        return Promise.reject(err)
    });
}

//获取npm包源地址，默认从taobao获取
function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

async function getNpmLatestVersion (npmName, registry){
  let versions = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort((a, b) => semver.gt(b, a))[0];
  }
  return null;
}

async function getNpmVersions (npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}
module.exports = {
  getNpmInfo,
  getDefaultRegistry,
  getNpmLatestVersion
};
