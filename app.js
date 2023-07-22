/**
 * 파일 경로: /
 * 파일 이름: app.js
 * 
 * 파일 작성자: NeraCocoZ
 * 작성자 메일: neracocoz@gmail.com
 * 
 * 파일 생성일: 2023-07-22, 토
 * 
 * 이 파일은 "코드 정리 및 최적화"가 완료된 파일입니다.
 */

// 모듈 선언
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

// 환경변수 선언
require("dotenv").config();

// 유틸 선언
const utils = require("./utils");

// 변수 선언
let serverSetting = {
    port: 8080,
    address: "0.0.0.0"
};

// 서버 선언
const app = express();

// 서버 설정
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secure: false,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

// 서버 라우터 선언
const routerIndex = require("./router/routerIndex"); // 메인 라우터
const routerLogin = require("./router/routerLogin"); // 로그인 라우터
const routerRegister = require("./router/routerRegister"); // 회원가입 라우터
const routerApi = require("./router/routerApi"); // API 라우터

// 서버 라우터 사용
app.use("/", routerIndex);
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/api", routerApi);

// 서버 실행
app.listen(serverSetting.port, serverSetting.address, () => utils.log("Server is Open;"));