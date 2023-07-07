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

/**
 * Colorful log message.
 * @param {string} message message text
 */
exports.log = function(message){
    console.log(chalk.bgWhiteBright(`${chalk.black(`[ ${chalk.magenta("Server")} ] ${message}`)}`));
}

