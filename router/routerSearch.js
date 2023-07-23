/**
 * 파일 경로: /router
 * 파일 이름: routerSearch.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-23, 일
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
// GET /search
router.get(`/`, async (req, res) => {
	// 변수 선언
	let {characterName} = req.query;
	
	// 닉네임이 없을때
	if(!characterName)
    	res.redirect("/");
	
	else{
		// 변수 선언
		let characterNameEncode = encodeURI(characterName)
		let characterDataUrl = `http://127.0.0.1:8080/api/maplestory/v1/characterData?characterName=${characterNameEncode}`;
		let characterData = await request.get(characterDataUrl);
		let characterDataJSON = JSON.parse(characterData);
		
		res.render("search", {data: characterDataJSON.data});
	}
});

// 모듈 내보내기
module.exports = router;