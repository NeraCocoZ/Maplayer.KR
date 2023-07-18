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
const fs = require("fs"); // File System

// Variable Require
let api_version = "v1";

// Metadata Require
const max_exp_json = JSON.parse(fs.readFileSync("./metadata/max_exp.json"));
const server_list_json = JSON.parse(fs.readFileSync("./metadata/server_list.json"));

// Router GET
// GET api/v1/maple/union?charactername=${character_name}
router.get(`/${api_version}/maple/union`, async (req, res) => {
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

// GET api/v1/maple/characterdata?charactername=${character_name}
router.get(`/${api_version}/maple/characterdata`, async (req, res) => {
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

    let maple_character_data_html = await request(request_option);
    let maple_character_data_cheerio = cheerio.load(maple_character_data_html);

    let maple_character_data_server_check = maple_character_data_cheerio("tr.search_com_chk").length == 0 ? false : true;

    // If Reboot
    if(!maple_character_data_server_check){
        request_option = {
            url: "https://maplestory.nexon.com/N23Ranking/World/Total",
            qs: {
                w: "254",
                c: character_name
            }
        };

        maple_character_data_html = await request(request_option);
        maple_character_data_cheerio = cheerio.load(maple_character_data_html);
    }
    
    // Maplestory Union Leve Crawling
    try{
        // Character Server
        let maple_character_server_url = maple_character_data_cheerio("tr.search_com_chk > td.left > dl > dt > a > img").attr("src");
        let maple_character_server_name = server_list_json[maple_character_server_url.replace("https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_", "").replace(".png", "")];

        // Character Name
        let maple_character_name_text = maple_character_data_cheerio("tr.search_com_chk > td.left > dl > dt > a").text();

        // Character Class
        let maple_character_class_text = maple_character_data_cheerio("tr.search_com_chk > td.left > dl > dd").text();

        // Character Level
        let maple_character_level_text = maple_character_data_cheerio("tr.search_com_chk > td:nth-child(3)").text();

        // Character Exp
        let maple_character_exp_text = maple_character_data_cheerio("tr.search_com_chk > td:nth-child(4)").text();
        let maple_character_exp_number = Number(maple_character_exp_text.replace(/,/g, ""));

        // Character Exp Persent
        let maple_character_max_exp = max_exp_json[maple_character_level_text.replace("Lv.", "")];
        let maple_character_exp_persent = (maple_character_exp_number / maple_character_max_exp * 100).toFixed(3);

        // Character Pop
        let maple_character_pop_text = maple_character_data_cheerio("tr.search_com_chk > td:nth-child(5)").text();
        let maple_character_pop_number = Number(maple_character_pop_text.replace(/,/g, ""))

        // Character Guild Name
        let maple_character_guild_name = maple_character_data_cheerio("tr.search_com_chk > td:nth-child(6)").text();

        result.data = {
            character_server_icon: maple_character_server_url,
            character_server_name: maple_character_server_name,
            character_name: maple_character_name_text,
            character_class: maple_character_class_text,
            character_level: maple_character_level_text,
            character_exp: maple_character_exp_number,
            character_max_exp: maple_character_max_exp,
            character_exp_persent: maple_character_exp_persent,
            character_pop: maple_character_pop_number,
            character_guild_name: maple_character_guild_name
        };
    }
    catch(err){
        result.result = false;
        result.message = "캐릭터를 찾을 수 없습니다."
        
        console.error(err)
    }

    res.json(result);
});

// GET api/v1/maple/characterlist?apikey=${api_key}
router.get(`/${api_version}/maple/characterlist`, async (req, res) => {
    // Variable Require
    let api_key = req.query.apikey;
    let result = {
        result: true
    }
    let character_list = [];

    // Maplestory get API
    for(let i = 1; i <= 30; i ++){
        // Variable Require
        let date = new Date("2022-12-26");

        // Set Date
        date.setDate(date.getDate() - i);

        // Get Date
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");

        let date_string = `${year}-${month}-${day}`;

        // Request Option
        let request_option = {
            url: "https://public.api.nexon.com/openapi/maplestory/v1/cube-use-results",
            headers: {
                Authorization: api_key
            },
            qs: {
                count: 1000,
                date: date_string
            }
        };

        // Maplestory Character List Get API
        try{
            let maple_characterlist_json = JSON.parse(await request(request_option));
            let maple_characterlist_cube_histories = maple_characterlist_json.cube_histories;
            
            if(maple_characterlist_cube_histories.length != 0){
                for(let data in maple_characterlist_cube_histories){
                    let maple_characterlist_charactername = maple_characterlist_cube_histories[data].character_name;

                    if(character_list.indexOf(maple_characterlist_charactername) == -1){
                        character_list.push(maple_characterlist_charactername);
                    }
                }
            }

            result.characterlist = character_list;
        }
        catch(err){
            result.result = false;
            result.message = "알수없는 오류가 발생했습니다."
            
            console.error(err)
        }
    }

    res.json(result);
});

module.exports = router;