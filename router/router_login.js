/**
 * File Path: /router/
 * File Name: router_login.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-09, Sun
 */

// Module Require
const express = require("express"); // Express
const router = express.Router(); // Express Router
const fs = require("fs"); // File System
const crypto = require("crypto"); // Crypto
const request = require("request-promise-native");

// Utils Module Require
const utils = require("../utils"); // Utils

// Variable Require

// Router GET
// GET /login
router.get(`/`, (req, res) => {
    // Check session
    let check_login = req.session.login;

    if(check_login){
        res.redirect("/");
    }
    else
        res.render("login");
});

// Router POST
// POST /login
router.post(`/`, (req, res) => {
    // Variable Require
    let userdata_path = `./data/userdata`;
    let {username, password} = req.body;
    let result = false;

    // Check username
    let userlist = fs.readdirSync(userdata_path);

    for(let user in userlist){
        // Find username
        if(userlist[user] == `${username}.json`){
            // Check password
            let userdata = JSON.parse(fs.readFileSync(`${userdata_path}/${username}.json`, "utf-8"));

            // Login Success
            if(userdata.password == password){
                // Create Token
                let token = crypto.randomBytes(64).toString("base64");

                // Update Token
                userdata.login_token = token;

                // Save Token
                fs.writeFileSync(`${userdata_path}/${username}.json`, JSON.stringify(userdata, null, 4), "utf-8");

                // Upload Token List
                let token_list = JSON.parse(fs.readFileSync(`./data/token/token_list.json`, "utf-8"));
                token_list[username] = token;
                fs.writeFileSync(`./data/token/token_list.json`, JSON.stringify(token_list, null, 4), "utf-8")

                req.session.login = username;
                res.cookie("login", token);
                result = true;
                break;
            }
        }
    }

    if(result) res.redirect("/");
    else res.redirect("/login");
});

// POST /login/getusername
router.post(`/getusername`, (req, res) => {
    let result = {
        result: false
    }

    // Check Session
    let login_session = req.session.login;

    if(login_session != undefined){
        result.result = true;
        result.username = login_session;
    }

    res.json(result);
});

// POST /login/checkapikey
router.post(`/checkapikey`, (req, res) => {
    let result = {
        result: false
    }

    // Check Session
    let login_session = req.session.login;

    if(login_session != undefined){
        let userdata = JSON.parse(fs.readFileSync(`./data/userdata/${login_session}.json`, "utf-8"));

        // Check API Key
        if(userdata.apikey == undefined){
            result.message = "apikey_undefined";
        }
        else{
            result.result = true;
        }
    }
    else{
        result.message = "not_logined";
    }

    res.json(result);
});

// POST /login/uploadapikey
router.post(`/uploadapikey`, async (req, res) => {
    let result = {
        result: false
    }

    // Check Session
    let login_session = req.session.login;

    if(login_session != undefined){
        // Check API Key
        let {apikey} = req.body;
        let apikey_api_url = `http://127.0.0.1:8080/api/v1/maple/characterlist?apikey=${apikey}`
        let apikey_check = JSON.parse(await request.get(apikey_api_url));

        if(apikey_check.result == true){
            result.result = true;
            result.character_list = apikey_check.characterlist;

            // Upload API Key
            let userdata = JSON.parse(fs.readFileSync(`./data/userdata/${login_session}.json`, "utf-8"));
            userdata.apikey = apikey;
            fs.writeFileSync(`./data/userdata/${login_session}.json`, JSON.stringify(userdata, null, 4), "utf-8");
        }
    }
    else{
        result.message = "not_logined";
    }

    res.json(result);
});

// POST /login/logout
router.post(`/logout`, (req, res) => {
    let result = {
        result: false
    }

    // Check Session
    let login_session = req.session.login;

    if(login_session != undefined){
        delete req.session.login;
        result.result = true;
    }

    res.json(result);
});


module.exports = router;