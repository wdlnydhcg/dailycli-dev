/*
 * @Author: MrAlenZhong
 * @Date: 2021-12-16 20:13:07
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2021-12-24 14:31:47
 * @Description: 
 */
'use strict';
const Command = require("@dailycli-dev/command");
class InitCommand extends Command {
    init(){
        this.projectName = this._argv;
        // this.cmd
        console.log('i am initCommand init', this._argv);
    }
    exec(){
        console.log('i am initCommand exec');
    }
}

function init (argv) {
    return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
