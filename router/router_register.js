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
// POST /register/checkApiKey
router.post(`/checkApiKey`, async (req, res) => {
    // 변수 선언
    let result = {result: false};
    let {apiKey} = req.body;
    let apiKeyUrl = `http://127.0.0.1:8080/api/maplestory/v1/characterList?apiKey=${apiKey}`
    let apiKeyData = await request.get(apiKeyUrl);
    let apiKeyJSON = JSON.parse(apiKeyData);

    if(apiKeyJSON.result){
        result.result = true;
        result.characterList = apiKeyJSON.characterList;
        req.session.characterList = characterList;
    }
    
    res.json(result);
});

// POST /register/getCharacterListServer
router.post(`/getCharacterListServer`, async(req, res) => {
    // 변수 선언
    let result = {result: false};
    let characterServerList = [];
    let characterServerIconList = [];

    try{
        // 캐릭터 서버 가져오기
        let characterList = req.body["characterList[]"];

        // 배열 체크
        if(!Array.isArray(characterList)){
            let tempCharacterName = characterList;
            characterList = new Array();
            characterList.push(tempCharacterName);
        }

        for(let characterName in characterList){
            let characterNameEncode = encodeURI(characterList[characterName])
            let characterDataUrl = `http://127.0.0.1:8080/api/maplestory/v1/characterData?characterName=${characterNameEncode}`;
            let characterData = await request.get(characterDataUrl);
            let characterDataJSON = JSON.parse(characterData);

            characterServerList.push(characterDataJSON["data"]["characterServerName"]);
            characterServerIconList.push(characterDataJSON["data"]["characterServerIcon"]);
        }

        // 캐릭터 서버 배열 확인
        if(characterServerList.length == characterList.length){
            result.result = true;
            result.characterServerList = characterServerList;
            result.characterServerIconList = characterServerIconList;
        }
        else{
            result.errorMessage = "알수없는 오류가 발생했습니다.";
            result.error = "배열의 길이가 다릅니다."
        }
    }
    catch(err){
        result.errorMessage = "알수없는 오류가 발생했습니다.";
        result.error = err;
    }

    // 데이터 전송
    res.json(result);
});

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