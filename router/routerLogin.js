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
router.post(`/login`, async (req, res) => {
    // 변수 선언
    let {userName, passWord} = req.body;
    let loginResult = false;

    // 사용자 이름 확인
    let sqlUserName = await utils.sendQuery(`SELECT userName FROM MAPLAYERKR_USER_TB WHERE userName = "${userName}"`);
    let checkUserName = sqlUserName.length != 0 ? true : false;

    if(checkUserName){
        // 비밀번호 확인
        let sqlPassWord = await utils.sendQuery(`SELECT passWordKey, passWordSalt FROM MAPLAYERKR_USER_TB WHERE userName = "${userName}"`);
        let {passWordKey, passWordSalt} = sqlPassWord[0];

        let hashedPassWord = crypto.pbkdf2Sync(passWord, passWordSalt, 154621, 64, "SHA512").toString("base64");

        if(hashedPassWord == passWordKey){
            // 로그인 성공
            req.session.checkLogin = userName;
            loginResult = true;
            utils.log(`로그인 - 아이디: ${userName};`);
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
		utils.log(`로그아웃 - 아이디: ${checkLogin};`);
    };

    // 데이터 전송
    res.json(result);
})

// 모듈 내보내기
module.exports = router;