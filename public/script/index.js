/**
 * File Path: /public/script/
 * File Name: index.css
 * 
 * Author: NeraCocoZ
 * Email : neracocoz@gmail.com
 * 
 * Create Date: 2023-07-10, Mon
 */

// Variable Require

$(document).ready(() => {
    // Random Background
    let random_background = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    $("#random_background").attr("id", `random_background_${random_background}`);

    // Check API Key
    $.ajax({
        type: "POST",
        url: "/login/checkapikey",
        success: (result) => {
            // Check API Key
            if(result.result == false){
                if(result.message == "apikey_undefined"){
                    $('#api_modal').modal("show");
                }

                // Check API Key
            }
        },
        error: () => {
            console.log("error");
        }
    });

    // Upload API Key
    $("#apikey_button").click(() => {
        $.ajax({
            type: "POST",
            url: "/login/uploadapikey",
            data: {apikey: $("#apikey").val()},
            success: (result) => {
                // Upload API Key
                if(result.result == true){
                    $("#apikey_button").html("API Key 등록 완료.")
                    $("#character_list").prop("disabled", false);

                    $("#character_list option").remove();
                    
                    for(let character in result.character_list){
                        let option = `<option value="${character}">${character_list[character]}</option>`
                        $("#character_list").append(option);
                    }
                }
            },
            error: () => {
                console.log("error");
            },
            beforeSend: () => {
                $("#apikey_button").prop("disabled", true);
                $("#apikey_button").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">불러오는중...</span>`)
            }
        });
    });
});