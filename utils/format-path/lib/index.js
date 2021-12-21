/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-20 15:09:09
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-20 15:55:19
 * @Description: 
 */
'use strict';
const path = require('path')
module.exports = formatPath;

//根据路径中的 / 还是 \ 判断是mac还是windows
//如果是window就替换为 /
function formatPath(p) {
    if (p && typeof p === 'string') {
        const sep = path.sep;
        if (sep === '/') {
            return p;
        } else {
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}
