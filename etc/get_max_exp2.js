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
const fs = require("fs"); // File System

// Variable Require
let metadata_path = "./etc/metadata_text/max_exp_metadata2.txt";
let matadata_data = fs.readFileSync(metadata_path, {encoding: "utf-8"});

let metadata_split = matadata_data.split("\n");

let result = {

}

for(let i = 0; i < metadata_split.length; i ++){
    let metadata_level;
    let metadata_exp;

    if(i % 4 == 0){
        metadata_level = metadata_split[i].split("→")[0].trim();
        metadata_exp = Number(metadata_split[i + 1].replace(/,/g, "").replace("[3]", "").replace("[5]", "").replace("[6]", "").replace("[7]", ""));
    }

    result[metadata_level] = metadata_exp;
}

console.log(result)
