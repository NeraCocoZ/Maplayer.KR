/**
 * 파일 경로: /router
 * 파일 이름: router_api.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-16, 일
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

// 모듈 선언
const express = require("express"); // Express
const router = express.Router(); // Express Router
const request = require("request-promise-native"); // Request-Promise-Native
const cheerio = require("cheerio"); // Cheerio
const fs = require("fs"); // File System

// 변수 선언
let apiVersion = "v1";

// 메타데이터 선언
const maxExp = fs.readFileSync("./metadata/max_exp.json");
const serverList = fs.readFileSync("./metadata/server_list.json");

const maxExpJSON = JSON.parse(maxExp);
const serverListJSON = JSON.parse(serverList);

// GET 호출
// GET api/maplestory/{apiVersion}/characterData?characterName={characterName}
router.get(`/maplestory/${apiVersion}/characterData`, async (req, res) => {
    // 변수 선언
    let {characterName} = req.query;
    let result = {result: true};

    // Request 설정
    let requestUrl = "https://maplestory.nexon.com/N23Ranking/World/Total";
    let requestOption = {
        url: requestUrl,
        qs: {c: characterName}
    };

    // Request 요청
    let characterDataHtml = await request(requestOption);
    let $ = cheerio.load(characterDataHtml);

    // 서버 체크
    let serverCheck = $("tr.search_com_chk").length == 0 ? false : true;

    // 리부트 서버 일때
    if(!serverCheck){
        // Request 설정
        requestOption = {
            url: requestUrl,
            qs: {w: "254", c: characterName}
        };

        // Request 요청
        characterDataHtml = await request(requestOption);
        $ = cheerio.load(characterDataHtml);
    }

    // 메이플스토리 캐릭터 데이터 크롤링
    try{
		// 캐릭터 이미지
		let characterImage = $("tr.search_com_chk > td.left > span > img:nth-child(1)").attr("src");
		
        // 캐릭터 서버
        let characterServerIcon = $("tr.search_com_chk > td.left > dl > dt > a > img").attr("src");
        let characterServerCode = characterServerIcon.replace("https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_", "").replace(".png", "");
        let characterServerName = serverListJSON[characterServerCode];

        // 캐릭터 이름
        let characterName = $("tr.search_com_chk > td.left > dl > dt > a").text();

        // 캐릭터 직업
        let characterClass = $("tr.search_com_chk > td.left > dl > dd").text();

        // 캐릭터 레벨
        let characterLevel = $("tr.search_com_chk > td:nth-child(3)").text();

        // 캐릭터 경험치
        let characterExpString = $("tr.search_com_chk > td:nth-child(4)").text();
        let characterExp = Number(characterExpString.replace(/,/g, ""));

        // 캐릭터 최대 경험치
        let characterMaxExp = maxExpJSON[characterLevel.replace("Lv.", "")];

        // 캐릭터 경험치 퍼센트
        let characterExpPersent = (characterExp / characterMaxExp * 100).toFixed(3);

        // 캐릭터 인기도
        let characterPopString = $("tr.search_com_chk > td:nth-child(5)").text();
        let characterPop = Number(characterPopString.replace(/,/g, ""))

        // 캐릭터 길드
        let characterGuild = $("tr.search_com_chk > td:nth-child(6)").text();

        // 결과
        result.data = {
            characterServerIcon: characterServerIcon,
            characterServerName: characterServerName,
			characterImage: characterImage,
            characterName: characterName,
            characterClass: characterClass,
            characterLevel: characterLevel,
            characterExp: characterExp,
            characterMaxExp: characterMaxExp,
            characterExpPersent: characterExpPersent,
            characterPop: characterPop,
            characterGuild: characterGuild
        };
    }
    // 오류 발생시
    catch(error){
        result.result = false;
        result.message = "캐릭터를 찾을 수 없습니다.";
        result.err = error;
        console.error(error)
    }

    // 데이터 전송
    res.json(result);
});

// GET api/maplestory/{apiVersion}/characterList?apiKey={apiKey}
router.get(`/maplestory/${apiVersion}/characterList`, async (req, res) => {
    // 변수 선언
    let {apiKey} = req.query;
    let result = {result: true};
    let characterList = [];

    // 메이플스토리 API 받아오기
    try{
        for(let i = 1; i <= 30; i ++){
            // 변수 선언
            let date = new Date();
            date.setDate(date.getDate() - i);
    
            let dateYear = date.getFullYear();
            let dateMonth = (date.getMonth() + 1).toString().padStart(2, "0");
            let dateDay = date.getDate().toString().padStart(2, "0");
    
            let dateString = `${dateYear}-${dateMonth}-${dateDay}`;
    
            // Request 설정
            let requestUrl = "https://public.api.nexon.com/openapi/maplestory/v1/cube-use-results";
            let requestOption = {
                url: requestUrl,
                headers: {Authorization: apiKey},
                qs: {count: 1000, date: dateString}
            };
    
            // Request 요청
            let characterListRequest = await request(requestOption);
            let characterListJSON = JSON.parse(characterListRequest);
            let characterListCubeHistories = characterListJSON["cube_histories"];
    
            // 큐브 히스토리 결과가 있으면
            if(characterListCubeHistories.length != 0){
                for(let data in characterListCubeHistories){
                    let characterName = characterListCubeHistories[data]["character_name"];
    
                    if(characterList.indexOf(characterName) == -1)
                        characterList.push(characterName);
                }
            }
        }
        characterList.push("세작나");
        characterList.push("문별이바퍼");
        characterList.push("껀호");
        characterList.push("튀잉");
        characterList.push("길냥이콜렉터");
        result.characterList = characterList;
    }
    // 오류 발생시
    catch(error){
        result.result = false;
        result.message = "알수없는 오류가 발생했습니다.";
        result.err = error;
    }

    // 데이터 전송
    res.json(result);
});

// 모듈 내보내기
module.exports = router;