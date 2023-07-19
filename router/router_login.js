/**
 * 파일 경로: /router
 * 파일 이름: router_login.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-17, 월
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

// 모듈 선언
const express = require("express"); // Express
const router = express.Router(); // Express Router
const fs = require("fs"); // File System
const crypto = require("crypto"); // Crypto
const request = require("request-promise-native"); // Request-Promise-Native

// Utils 모듈 선언
const utils = require("../utils");

// 변수 선언

// GET 호출
// GET /login
router.get(`/`, (req, res) => {
    // 로그인 세션 체크
    let {checkLogin} = req.session;

    if(checkLogin)
        res.redirect("/");

    else
        res.render("login");
});

// POST 호출
// POST /login/login
router.post(`/login`, (req, res) => {
    // 변수 선언
    let userDataPath = `./data/userdata`;
    let {userName, passWord} = req.body;
    let loginResult = false;

    // 사용자 이름 확인
    let userList = fs.readdirSync(userDataPath);

    for(let user in userList){
        // 사용자 이름 찾기
        if(userList[user] == `${userName}.json`){
            // 비밀번호 확인
            let userDataFile = fs.readFileSync(`${userDataPath}/${userName}.json`, "utf-8");
            let userDataJSON = JSON.parse(userDataFile);
            console.log(userDataJSON)

            // 로그인 성공시
            if(userDataJSON.passWord == passWord){
                req.session.checkLogin = userName;
                loginResult = true;
                utils.log(`로그인 성공! 아이디: ${userName}`);
                break;
            }
        }
    }

    if(loginResult)
        res.redirect("/");
    else
        res.redirect("/login");
});

// POST /login/logout
router.post(`/logout`, (req, res) => {
    // 변수 선언
    let result = {result: false};

    // 로그인 세션 확인
    let {checkLogin} = req.session;

    if(checkLogin){
        delete req.session.checkLogin;
        result.result = true;
    };

    // 데이터 전송
    res.json(result);
})

// 모듈 내보내기
module.exports = router;