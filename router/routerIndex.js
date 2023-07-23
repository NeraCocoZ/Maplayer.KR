/**
 * 파일 경로: /router
 * 파일 이름: router_index.js
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
const request = require("request-promise-native");

// Utils 모듈 선언
const utils = require("../utils");

// 변수 선언

// GET 호출
// GET /
router.get(`/`, (req, res) => {
    res.render(`index`);
});

// POST 선언
// POST /getUserName
router.post(`/getUserName`, async (req, res) => {
    // 변수 선언
    let result = {result: false};

    // 로그인 세션 체크
    let {checkLogin} = req.session;

    if(checkLogin){
		// 변수 선언
		let sqlUserName = await utils.sendQuery(`SELECT mainCharacterName FROM MAPLAYERKR_USER_TB WHERE userName = "${checkLogin}"`);
		
        result.result = true;
        result.userName = sqlUserName[0].mainCharacterName;
    }

    // 데이터 전송
    res.json(result);
});

// POST /checkApiKey
router.post(`/checkApiKey`, async (req, res) => {
    // 변수 선언
    let result = {result: false};

    // 로그인 세션 체크
    let {checkLogin} = req.session;

    if(checkLogin){
        // APIKEY 체크
        let sqlUserData = await utils.sendQuery(`SELECT apiKey FROM MAPLAYERKR_USER_TB WHERE userName = "${checkLogin}"`);
        let userData = sqlUserData[0];

        if(!userData.apiKey)
            result.errorMessage = "apikey";
        else
            result.result = true;
    }
    else
        result.errorMessage = "login";

    // 데이터 전송
    res.json(result);
});

// POST /sendApiKey
router.post(`/sendApiKey`, async(req, res) => {
    // 변수 선언
    let result = {result: false};

    // 로그인 세션 체크
    let {checkLogin} = req.session;

    if(checkLogin){
        // APIKEY 체크
        let {apiKey} = req.body;
        let apiKeyUrl = `http://127.0.0.1:8080/api/maplestory/v1/characterList?apiKey=${apiKey}`
        let apiKeyData = await request.get(apiKeyUrl);
        let apiKeyJSON = JSON.parse(apiKeyData);

        if(apiKeyJSON.result){
            result.result = true;
            result.characterList = apiKeyJSON.characterList;
        }
    }
    else
        result.errorMessage = "login";

    // 데이터 전송
    res.json(result);
});

// POST /getCharacterServer
router.post(`/getCharacterServer`, async(req, res) => {
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

// 모듈 내보내기
module.exports = router;