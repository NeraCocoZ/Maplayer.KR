# Maplayer.KR

# TODO
  * ~~Passport 사용~~ (못해먹겠음)
  * 데이터베이스 사용 (절실함;;)

# API
  * API_KEY는 서비스로 입력 받아야 한다.
  * 전날 기준으로 30일 기록 조회
  
# 코드 정리 및 최적화
## 2023-07-16 - 코드 정리 및 최적화 시작.
  * /router/router_api.js 수정 완료 (연결되는 결과의 변수명은 수정 예정)

## 2023-07-17 - 코드 정리 및 최적화 2일차.
  * /router/router_index.js 수정 완료
  * /router/router_login.js 수정 완료 (기타 POST는 router_index.js 로 이전)

## 2023-07-18 - 코드 정리 및 최적화 3일차.
  * /views/Etc/apiModal.ejs 수정 완료. (파일 이름 변경: api_modal.ejs -> apiModal.ejs)
  * /views/Etc/header.ejs 수정 완료. (모든 JS 파일 연결 제거)
  * /views/index.ejs 수정 완료.
  * /public/style/font.css 추가 완료.
  * /public/style/index.css 수정 완료. (기존 background.css 통합)

## 2023-07-19 - 코드 정리 및 최적화 4일차.
  * /views/login.ejs 수정 완료.
  * /public/script/header.js 수정 완료.
  

# 회원가입 로직
  1. 회원가입 화면
  2. 아이디 입력
  3. 비밀번호 입력
  4. 비밀번호 재입력
  5. API키 입력
  6. 캐릭터 목록 불러오기 버튼 클릭
      1. 서버에 API Key Check 요청
      2. 데이터베이스에 캐릭터 목록 임시 저장
      3. 만약 유효한 API Key면 목록 받아서 Select에 추가
      4. 만약 유효하지 않은 API Key면 오류 창 띄우기
  7. 대표 캐릭터 선택
  8. 회원가입 버튼 클릭
      1. 서버에 회원가입 요청, 캐릭터 정보는 Value값인 숫자로만 보내기
      2. 데이터베이스에 있는 캐릭터 목록으로 대표 캐릭터 추가
      3. 데이터베이스에 회원 정보 추가
  9. 회원가입 완료