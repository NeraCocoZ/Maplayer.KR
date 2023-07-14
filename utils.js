/**
 * File Path: /
 * File Name: utils.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-06, Thu
 */

// Module Require
const chalk = require("chalk"); // Chalk # 4.1.2
const fs = require("fs"); // File System

/**
 * Colorful log message.
 * @param {string} message message text
 */
exports.log = function(message){
    console.log(chalk.bgWhiteBright(`${chalk.black(`[ ${chalk.magenta("Server")} ] ${message}`)}`));
}

/**
 * User login token check.
 * @param {string} token user login token
 * @returns username or false
 */
exports.readToken = function(token){
    // Token List
    let token_list = JSON.parse(fs.readFileSync(`./data/token/token_list.json`, "utf-8"));

    for(key in token_list){
        if(token_list[key] == token)
            return key;
    }

    return false;
}