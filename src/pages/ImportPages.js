import { lazy } from "react";

const Main = lazy(() => import("./Main/Main"));
const Join = lazy(() => import("./Join/Join"));
const Login = lazy(() => import("./Login/Login"));
const MyPage = lazy(() => import("./Mypage/MyPage")); //마이페이지 들어갔을때 기본적으로 회원정보 표시하기 위함.
const MyPageInfo = lazy(() => import("./Mypage/MyPageInfo"));
const ModifyInfo = lazy(() => import("./Mypage/ModifyInfo"));
const Donate = lazy(() => import("./Support/Donate"));
const FindPW = lazy(() => import("./Login/FindPW"));
const ChangePW = lazy(() => import("./Login/ChangePW"));
const DonateApply = lazy(() => import("./Support/DonateApply"));

//아래에 import할 페이지 함수 생성

export {
  Main,
  Join,
  Login,
  MyPage,
  MyPageInfo,
  ModifyInfo,
  Donate,
  FindPW,
  ChangePW,
  DonateApply,
};
