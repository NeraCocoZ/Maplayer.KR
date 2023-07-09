/**
 * File Path: /passport/
 * File Name: passport.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-09, Sun
 */

// Module Require
const passport = require("passport");
const local_strategy = require("passport-local").Strategy;
const fs = require("fs");

module.exports = () => {
    passport.use("local_signup", new local_strategy({
        usernameField: "input_username",
        passwordField: "input_password",
        passReqToCallback: true
    }, (req, username, password, done) => {
        // Check username
        let check_username = fs.existsSync(`../data/userdata/${username}.json`);

        console.log(check_username);
    }))
}