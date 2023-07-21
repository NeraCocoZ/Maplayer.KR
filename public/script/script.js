/**
 * 파일 경로: /public/script
 * 파일 이름: script.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-21, 금
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

$(document).ready(() => {
    // 랜덤 배경화면
    let randomBackground = Math.floor(Math.random() * 7) + 1;
    $("#randomBackground").attr("id", `randomBackground${randomBackground}`);
});