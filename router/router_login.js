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
const passport = require("passport");
const fs = require("fs"); // File System

// Utils Module Require
const utils = require("./utils"); // Utils

// Variable Require

// Router GET
// GET /login
router.get(`/`, (req, res) => {
    res.render("login");
});

// Router POST
// POST /login
router.get(`/`, (req, res) => {
    passport.authenticate("local_signin", {
        successRedirect: "/",
        failureRedirect: "/login"
    });
});

// POST /login/register
router.get(`/register`, (req, res) => {
    passport.authenticate("local_signup", {
        successRedirect: "/login",
        failureRedirect: "/login/register"
    });
});