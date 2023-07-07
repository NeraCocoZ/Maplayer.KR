/**
 * File Path: /router/
 * File Name: router_api.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-06, Thu
 */

// Module Require
const express = require("express"); // Express
const router = express.Router(); // Express Router
const request = require("request-promise-native"); // Request-Promise-Native
const cheerio = require("cheerio"); // Cheerio

// Variable Require
let api_version = "v1";

// Router GET
// GET api/v1/maple_union_level?charactername=${character_name}
router.get(`/${api_version}/maple_union_level`, async (req, res) => {
    // Variable Require
    let character_name = req.query.charactername;
    let result = {
        result: true
    }

    // Request Option
    let request_option = {
        url: "https://maplestory.nexon.com/N23Ranking/World/Union",
        qs: {
            c: character_name
        }
    };
    
    // Maplestory Union Leve Crawling
    try{
        let maple_union_html = await request(request_option);
        let maple_union_cheerio = cheerio.load(maple_union_html);

        let maple_union_level_text = maple_union_cheerio("tr.search_com_chk > td:nth-child(3)").text();
        let maple_union_level = Number(maple_union_level_text.replace(",", ""));

        result.data = {
            character_name: character_name,
            union_level: maple_union_level
        };
    }
    catch(err){
        result.result = false;
        result.message = "월드에서 가장 높은 레벨의 캐릭터의 이름을 입력해주세요."
        
        console.error(err)
    }

    res.json(result);
});

// GET api/v1/maple_character_data?charactername=${character_name}
router.get(`/${api_version}/maple_character_data`, async (req, res) => {
    // Variable Require
    let character_name = req.query.charactername;
    let result = {
        result: true
    }

    // Request Option
    let request_option = {
        url: "https://maplestory.nexon.com/N23Ranking/World/Total",
        qs: {
            c: character_name
        }
    };
    
    // Maplestory Union Leve Crawling
    try{
        let maple_character_data_html = await request(request_option);
        let maple_character_data_cheerio = cheerio.load(maple_character_data_html);

        // Character Name
        let maple_character_name_text = maple_character_data_cheerio("tr.search_com_chk > td.left > dl > dt > a").text();

        // Character Level
        let maple_character_level_text = maple_character_data_cheerio("tr.search_com_chk > td:nth-child(3)").text();

        // Character Class
        let maple_character_class_text = maple_character_data_cheerio("tr.search_com_chk > td.left > dl > dd").text();

        result.data = {
            character_name: maple_character_name_text,
            character_level: maple_character_level_text,
            character_class: maple_character_class_text
        };
    }
    catch(err){
        result.result = false;
        result.message = "캐릭터를 찾을 수 없습니다."
        
        console.error(err)
    }

    res.json(result);
})

module.exports = router;