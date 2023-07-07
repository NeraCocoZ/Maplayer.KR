/**
 * File Path: /
 * File Name: app.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-06, Thu
 */

// Module Require
const express = require("express"); // Express
const chalk = require("chalk"); // Chalk # 4.1.2

// Utils Module Require
const utils = require("./utils"); // Utils

// Variable Require
let server_port = 8080;
let server_address = "0.0.0.0";

// Server Require
const app = express();

// Server Setting

// Server Router Require
const router_api = require("./router/router_api"); // API Router

// Server Router Use
app.use("/api", router_api);

// Server Listen
app.listen(server_port, server_address, () => utils.log("Server is open;"));