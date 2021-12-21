/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-09 15:51:38
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-17 16:46:26
 * @Description: 
 */
'use strict';

function utils() {
    // TODO
}
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}
module.exports = {
  utils,
  isObject
};