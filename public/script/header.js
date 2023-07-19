/**
 * 파일 경로: /public/script
 * 파일 이름: header.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-19, 수
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

$(document).ready(() => {
    // 로그인 체크
    $.ajax({
        type: "POST",
        url: "/getUserName",
        success: (result) => {
            // 로그인 되있으면
            if(result.result){
                // 변수 선언
                let userName = result.userName;

                // 헤더 수정
                $("#navLogin").hide();
                $("#navRegister").hide();

                $("#navLogout").show();
                $("#navMypage").show();

                $("#navUsername").html(userName);
            }
            // 로그인이 안되있으면
            else{
                // 헤더 수정
                $("#navLogin").show();
                $("#navRegister").show();

                $("#navLogout").hide();
                $("#navMypage").hide();

                $("#navUsername").html(`userName`);
            }
        }
    });

    // 로그아웃
    function logout(){
        $.ajax({
            type: "POST",
            url: "/login/logout",
            success: (result) => {
                // 로그아웃 성공
                if(result.result)
                    window.location.href = "/";
            }
        });
    }
});