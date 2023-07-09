/**
 * File Path: /router/
 * File Name: router_index.js
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

// Utils Module Require
const utils = require("./utils"); // Utils

// Variable Require

// Router GET
// GET /
router.get(`/`, (req, res) => {
    res.render("index");
});