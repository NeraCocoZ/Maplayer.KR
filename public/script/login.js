/**
 * File Path: /public/script/
 * File Name: index.css
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-11, Tue
 */

// Check Login
function check_login(){
    // Variable Require
    let username = $("input#username");
    let password = $("input#password");

    // Check username
    if(username.val() == ""){
        username.addClass("border border-2 border-danger");
        username.focus();
        return false;
    }
    
    // Check password
    else if(password.val() == ""){
        password.addClass("border border-2 border-danger");
        password.focus();
        return false;
    }
}