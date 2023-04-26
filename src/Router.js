import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BROWSER_PATH } from "./constants/path";
import {
  Main,
  Login,
  MyPageInfo,
  ModifyInfo,
<<<<<<< HEAD
  // Donate,
=======
  MyPage,
  Donate,
>>>>>>> 9383e926868c015f13c8db0443ea3978bc6ce4a0
  FindPW,
  ChangePW,
} from "./pages/ImportPages";
import NotFound from "./pages/NotFound/NotFound";
import Loading from "./components/Loading/LoadingPage";

const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path={BROWSER_PATH.MAIN} element={<Main />} />
          <Route path={BROWSER_PATH.LOGIN} element={<Login />} />
<<<<<<< HEAD
          <Route path={BROWSER_PATH.MYPAGE} element={<MyPageInfo />} />
          <Route path={BROWSER_PATH.MYPAGEINFO} element={<MyPageInfo />} />
          <Route path={BROWSER_PATH.MODIFYINFO} element={<ModifyInfo />} />
          {/* <Route path={BROWSER_PATH.SUPPORT} element={<Donate />} /> */}
=======
          <Route exact path={BROWSER_PATH.MYPAGE} element={<MyPage />}>
            <Route index element={<MyPageInfo />} />
            <Route path={BROWSER_PATH.MODIFYINFO} element={<ModifyInfo />} />
          </Route>
          <Route path={BROWSER_PATH.SUPPORT} element={<Donate />} />
>>>>>>> 9383e926868c015f13c8db0443ea3978bc6ce4a0
          <Route path={BROWSER_PATH.FINDPW} element={<FindPW />} />
          <Route path={BROWSER_PATH.CHANGEPW} element={<ChangePW />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default Router;
