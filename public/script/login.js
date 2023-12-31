/**
 * 파일 경로: /public/script
 * 파일 이름: login.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-19, 수
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

// 로그인 입력 확인
function checkLogin(){
    // 변수 선언
    let userName = $("#userName");
    let passWord = $("#passWord");

    // userName이 빈칸일때
    if(userName.val() == ""){
        userName.addClass("border border-2 border-danger");
        userName.focus();
        return false;
    }

    // userName이 빈칸이 아닐때
    else
        userName.removeClass("border border-2 border-danger");
    
    // passWord가 빈칸일때
    if(passWord.val() == ""){
        passWord.addClass("border border-2 border-danger");
        passWord.focus();
        return false;
    }

    // passWord가 빈칸이 아닐때
    else
        passWord.removeClass("border border-2 border-danger");
}

// 회원가입 입력 확인
function checkRegister(){
    // 변수 선언
    let userName = $("#userName");
    let passWord = $("#passWord");
    let passWordCheck = $("#passWordCheck");

    // userName이 빈칸일때
    if(userName.val() == ""){
        userName.addClass("border border-2 border-danger");
        userName.focus();
        return false;
    }

    // userName이 빈칸이 아닐때
    else
        userName.removeClass("border border-2 border-danger");
    
    // passWord가 빈칸일때
    if(passWord.val() == ""){
        passWord.addClass("border border-2 border-danger");
        passWord.focus();
        return false;
    }

    // passWord가 빈칸이 아닐때
    else
        passWord.removeClass("border border-2 border-danger");

    // passWordCheck가 빈칸일때
    if(passWordCheck.val() == ""){
        passWordCheck.addClass("border border-2 border-danger");
        passWordCheck.focus();
        return false;
    }

    // passWordCheck가 빈칸이 아닐때
    else
        passWordCheck.removeClass("border border-2 border-danger");

    // passWord와 passWordCheck가 일치하지 않을때
    if(passWord.val() != passWordCheck.val()){
        passWordCheck.addClass("border border-2 border-danger");
        passWordCheck.focus();
        return false;
    }
    
    // passWord와 passWordCheck가 일치할때
    else
        passWordCheck.removeClass("border border-2 border-danger");
}