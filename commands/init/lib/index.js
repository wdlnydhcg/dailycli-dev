/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-16 20:13:07
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-21 08:37:34
 * @Description: 
 */
'use strict';

module.exports = init;

function init(projectName,cmdObj) {
    console.log('init', projectName, cmdObj.force, process.env.CLI_TARGET_PATH);
}
