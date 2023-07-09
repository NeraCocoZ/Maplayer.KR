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
const passport = require("passport");

// Utils Module Require
const utils = require("./utils"); // Utils

// Variable Require
let server_port = 8080;
let server_address = "0.0.0.0";

// Server Require
const app = express();

// Server Setting
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

// Server Router Require
const router_index = require("./router_index"); // Index Router
const router_api = require("./router/router_api"); // API Router

// Server Router Use
app.use("/", router_index);
app.use("/api", router_api);

// Server Listen
app.listen(server_port, server_address, () => utils.log("Server is open;"));