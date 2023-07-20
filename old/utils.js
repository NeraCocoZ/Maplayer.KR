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
const mysql = require("mysql2/promise");

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

// 상수 선언
const config = {
    "host": "112.175.184.60",
    "port": 3306,
    "user": "rpg",
    "password": "psh11080!",
    "database": "rpg",
    "connectionLimit": 1000
}
let pool = mysql.createPool(config);

/**
 * 함수 이름: sendQuery(string SQL);
 * 설명: SQL을 보내 값을 받아옵니다.
 * @param {string} SQL 
 * @returns rows;
 */
exports.sendQuery = async function(SQL){
    try{
        let conn = await pool.getConnection(async conn => conn);
        let [rows] = await conn.query(SQL);

        conn.release();

        return rows;
    }
    catch(e){
        console.log(e)
        return 0;
    }
}