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
        let element = $(`#${id}`);
        
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
                if(!result.result){
					if(result.errorMessage == "Overlap apiKey"){
						showErrorModal("캐릭터 목록 불러오기 오류", "이미 사용중인 API Key입니다.");
						$("#checkApiKey").prop("disabled", false);
						$("#checkApiKey").html("캐릭터 목록 불러오기");
					}
					else{
						showErrorModal("캐릭터 목록 불러오기 오류", "API Key가 유효하지 않습니다.");
						$("#checkApiKey").prop("disabled", false);
						$("#checkApiKey").html("캐릭터 목록 불러오기");
					}
                }
                
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

                                let option = `<option value="${character}">[ ${characterServer} ] ${characterName}</option>`;
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
                $("#checkApiKey").prop("disabled", false);
            },
            beforeSend: () => {
                // 로딩
                $("#checkApiKey").prop("disabled", true);
                $("#checkApiKey").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class="sr-only">불러오는중...</span>`)
            }
        })
    });

    $("#registerButton").click(() => {
        // 빈칸 확인
        if(checkRegister()){
            console.log("A")
            // 변수 선언
            let userName = $("#userName").val();
            let passWord = $("#passWord").val();
            let apiKey = $("#apiKey").val();
            let mainCharacter = $("#characterList").val();

            // 회원가입 요청
            $.ajax({
                type: "POST",
                url: "/register/register",
                data: {userName: userName, passWord: passWord, apiKey: apiKey, mainCharacter: mainCharacter},
                success: (result) => {
                    // 회원가입 성공
                    if(result.result){
                        showErrorModal("회원가입 성공", `아이디: ${userName}`);
                        window.location.href = "/login";
                    }
                    else{
                        // 아이디 중복
                        if(result.errorMessage == "Overlap userName"){
                            showErrorModal("회원가입 실패", "이미 사용중인 아이디 입니다.");
                        }
                        else if(result.errorMessage == "Overlap apiKey"){
                            showErrorModal("회원가입 실패", "이미 사용중인 API Key 입니다.");
                        }
                    }
                },
                error: () => {
                    showErrorModal("서버 연결 오류", "서버에 연결 할 수 없습니다.");
                }
            })
        }
    });
});

// 회원가입 빈칸 체크
function checkRegister(){
    // 변수 선언
    let inputElement = [$("#userName"), $("#passWord"), $("#passWordCheck"), $("#apiKey")];
    let checkPassWord = new RegExp('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

    // 빈칸 체크
    for(let element in inputElement){
        if(inputElement[element].val() == ""){
            inputElement[element].addClass("border border-2 border-danger");
            inputElement[element].focus();
            return false;
        }
        else
            inputElement[element].removeClass("border border-2 border-danger");
    }

    // 아이디 이메일 형식 확인
    if($("#userName").val().indexOf("@") == -1 || $("#userName").val().indexOf(".") == -1){
        $("#userName").addClass("border border-2 border-danger");
        $("#userName").focus();
        return false;
    }
    else
        $("#userName").removeClass("border border-2 border-danger");

    // 비밀번호 형식 확인
    if(!checkPassWord.test( $("#passWord").val())){
        $("#passWord").addClass("border border-2 border-danger");
        $("#passWord").focus();
        return false;
    }
    else
        $("#passWord").removeClass("border border-2 border-danger");
    
    // 비밀번호 재입력 확인
    if($("#passWord").val() != $("#passWordCheck").val()){
        $("#passWordCheck").addClass("border border-2 border-danger");
        $("#passWordCheck").focus();
        return false;
    }
    else
        $("#passWordCheck").removeClass("border border-2 border-danger");
    
    return true;
}