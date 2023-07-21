/**
 * 파일 경로: /public/script
 * 파일 이름: register.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-21, 금
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

$(document).ready(() => {
    // input의 값이 변경될때
    $("input").keyup((event) => {
        // 변수 선언
        let id = event.target.id;
        let element = $(`#${event.target.id}`);
        
        if(element.val() == ""){
            element.addClass("border border-2 border-danger");
            element.focus();
        }
        else{
            element.removeClass("border border-2 border-danger");
        }
    });

    // 아이디 이메일 형식 확인
    $("#userName").keyup(() => {
        if($("#userName").val().indexOf("@") == -1 || $("#userName").val().indexOf(".") == -1){
            $("#userName").addClass("border border-2 border-danger");
            $("#userName").focus();
        }
        else{
            $("#userName").removeClass("border border-2 border-danger");
        }
    });

    // 비밀번호 형식 확인
    $("#passWord").keyup(() => {
        // 변수 선언
        let checkPassWord = new RegExp('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

        if(!checkPassWord.test( $("#passWord").val())){
            $("#passWord").addClass("border border-2 border-danger");
            $("#passWord").focus();
        }
        else{
            $("#passWord").removeClass("border border-2 border-danger");
        }
    });

    // 비밀번호 재입력 확인
    $("#passWordCheck").keyup(() => {
        // 변수 선언
        if($("#passWord").val() != $("#passWordCheck").val()){
            $("#passWordCheck").addClass("border border-2 border-danger");
            $("#passWordCheck").focus();
        }
        else{
            $("#passWordCheck").removeClass("border border-2 border-danger");
        }
    });

    // 캐릭터 목록 불러오기 버튼 클릭
    $("#checkApiKey").click(() => {
        // 변수 선언
        let apiKey = $("#apiKey").val();

        $.ajax({
            type: "POST",
            url: "/register/checkApiKey",
            data: {apiKey: apiKey},
            success: (result) => {
                // API Key가 유효하지 않다면 
                if(!result.result)
                    showErrorModal("캐릭터 목록 불러오기 오류", "API Key가 유효하지 않습니다.");
                
                // API Key가 유효하다면
                else{
                    // 변수 선언
                    let characterList = result.characterList;
                    
                    // API Key 입력 수정
                    $("#apiKey").prop("disabled", true);

                    // 캐릭터 서버 불러오기
                    $.ajax({
                        type: "POST",
                        url: "/register/getCharacterListServer",
                        data: {characterList: characterList},
                        success: (result) => {
                            // 변수 선언
                            let characterServerList = result.characterServerList;
                            let characterServerIconList = result.characterServerIconList;

                            // Select 수정
                            $("#characterList").prop("disabled", false);
                            $("#characterList option").remove();

                            for(character in characterList){
                                let characterName = characterList[character];
                                let characterServer = characterServerList[character];
                                let characterServerIcon = characterServerIconList[character];

                                let option = `<option value="${character}" style='background'>">[ ${characterServer} ] ${characterName}</option>`;
                                $("#characterList").append(option);
                            }

                            // 버튼 수정
                            $("#checkApiKey").html("캐릭터 목록을 불러왔습니다.");
                            $("#registerButton").prop("disabled", false);
                        }
                    });
                }
            },
            error: () => {
                showErrorModal("서버 연결 오류", "서버에 연결 할 수 없습니다.");
            },
            beforeSend: () => {
                // 로딩
                $("#checkApiKey").prop("disabled", true);
                $("#checkApiKey").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">불러오는중...</span>`)
            }
        })
    });
});