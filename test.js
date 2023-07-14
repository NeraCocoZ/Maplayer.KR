const fs = require("fs"); // File System

let token = "wT8pjaV9ovqVvRI7C8J74nPq2//fY0KfL0nC9y236OA+1HGUZOxm5aI2smUwUdaj9IRZ5ROmni2bl0g6mV/6Nw==";

function a(){
    // Token List
    let token_list = JSON.parse(fs.readFileSync(`./data/token/token_list.json`, "utf-8"));

    for(key in token_list){
        if(token_list[key] == token)
            return key;
    }

    return false;
}

console.log(a())