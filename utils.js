/**
 * 파일 경로: /
 * 파일 이름: utils.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-20, 목
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

// 모듈 선언
const chalk = require("chalk"); // Chalk@4.1.2
const mysql = require("mysql2/promise"); // MySQL2

// 상수 선언
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 1000
}

// 변수 선언
let pool = mysql.createPool(dbConfig);

// 함수 선언
// utils.log - 로그를 작성합니다.
exports.log = (message) => {
    console.log(chalk.bgWhiteBright(`${chalk.black(`[ ${chalk.magenta("Server")} ] ${message}`)}`));
}

// utils.sendQuery - SQL을 보내 값을 받아옵니다.
exports.sendQuery = async (SQL) => {
    try{
        let conn = await pool.getConnection(async conn => conn);
        let [rows] = await conn.query(SQL);

        conn.release();

        return rows;
    }
    catch(error){
        console.log(error);
        return 0;
    }
}