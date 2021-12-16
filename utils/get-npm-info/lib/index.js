/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-16 14:16:58
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-16 15:09:34
 * @Description:
 */
"use strict";
const axios = require("axios");
const semver = require("semver");
const path = require("path");
const chalk = require("chalk");
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
function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

module.exports = {
  getNpmInfo,
};
