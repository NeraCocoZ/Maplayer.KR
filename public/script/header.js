/**
 * File Path: /public/script/
 * File Name: header.js
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-13, Thu
 */

$(document).ready(() => {
    // Check login
    $.ajax({
        type: "POST",
        url: "/login/getusername",
        success: (result) => {
            // Logined
            if(result.result == true){
                // Edit Navbar
                $("a#nav_a_signin").hide();
                $("a#nav_a_signup").hide();

                $("a#nav_a_signout").show();
                $("a#nav_a_username").show();

                $("a#nav_a_username").html(`<i class="fa-solid fa-user"></i> ${result.username}`);
            }

            // Not Logined
            else{
                // Edit Navbar
                $("a#nav_a_signin").show();
                $("a#nav_a_signup").show();

                $("a#nav_a_signout").hide();
                $("a#nav_a_username").hide();

                $("a#nav_a_username").html("username");
            }
        },
        error: () => {
            console.log("error");
        }
    });
})

// Logout
function logout(){
    $.ajax({
        type: "POST",
        url: "/login/logout",
        success: (result) => {
            // Logined
            if(result.result == true){
                window.location.href = "/";
            }
        },
        error: () => {
            console.log("error");
        }
    });
}