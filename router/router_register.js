/**
 * 파일 경로: /router
 * 파일 이름: router_register.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-20, 목
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
// GET /register
router.get(`/`, (req, res) => {
    // 로그인 세션 체크
    let {checkLogin} = req.session;

    if(checkLogin)
        res.redirect("/");

    else
        res.render("register");
});

// POST 호출
// POST /register/register
router.post(`/register`, async (req, res) => {
    // 변수 선언
    let {userName, passWord} = req.body;
    let registerResult = false;

    // 사용자 이름 중복 확인
    let sqlUserName = await utils.sendQuery(`SELECT userName FROM MAPLAYERKR_USER_TB WHERE userName = "${userName}"`);
    let checkUserName = sqlUserName.length != 0 ? false : true;

    if(checkUserName){
        // 비밀번호 암호화
        let passWordSalt = crypto.randomBytes(64).toString("base64");
        let passWordKay = crypto.pbkdf2Sync(passWord, passWordSalt, 154621, 64, "SHA512").toString("base64");

        // 사용자 업로드
        utils.sendQuery(`INSERT INTO MAPLAYERKR_USER_TB(userName, passWordKey, passWordSalt) VALUES("${userName}", "${passWordKay}", "${passWordSalt}")`);
        registerResult = true;
        utils.log(`회원가입 성공! 아이디: ${userName}`);
    }

    if(registerResult)
        res.redirect("/login");
    else
        res.redirect("/register");
});

// 모듈 내보내기
module.exports = router;