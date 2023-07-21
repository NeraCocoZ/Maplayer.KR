/**
 * 파일 경로: /public/script
 * 파일 이름: index.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-19, 수
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

$(document).ready(() => {
    // API KEY 확인
    $.ajax({
        type: "POST",
        url: "/checkApiKey",
        success: (result) => {
            // API KEY가 없다면
            if(!result.result){
                if(result.errorMessage == "apikey")
                    $("#apiModal").modal("show");
            }
        }
    });

    // API KEY 등록 버튼 클릭시
    $("#apiKeyButton").click(() => {
        // 변수 선언
        let apiKey = $("#apiKey").val();

        // API KEY 체크 및 캐릭터 목록 불러오기
        $.ajax({
            type: "POST",
            url: "/sendApiKey",
            data: {apiKey: apiKey},
            success: (result) => {
                // API KEY 체크 성공
                if(result.result){
                    // 변수 선언
                    let characterList = result.characterList;

                    // 캐릭터 이름 및 서버 불러오기
                    $("#apiKeyButton").html("API Key 체크 성공.");
                    $("#characterList").prop("disabled", false);
                    $("#characterList option").remove();

                    $.ajax({
                        type: "POST",
                        url: "/getCharacterServer",
                        header: {"Access-Control-Allow-Origin": "*"},
                        data: {characterList: characterList},
                        success: (result) => {
                            // 변수 선언
                            let characterServerList = result.characterServerList;
                            let characterServerIconList = result.characterServerIconList;

                            for(let character in characterList){
                                let characterName = characterList[character];
                                let characterServer = characterServerList[character];
                                let characterServerIcon = characterServerIconList[character];

                                let option = `<option value="${character}">[ <img src="${characterServerIcon}">${characterServer} ] ${characterName}</option>`;
                                $("#characterList").append(option);
                            }
                        }
                    })
                }
            },
            beforeSend: () => {
                // 로딩
                $("#apiKeyButton").prop("disabled", true);
                $("#apiKeyButton").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">불러오는중...</span>`)
            }
        });
    });
});