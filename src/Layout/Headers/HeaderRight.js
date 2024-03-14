import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import styled from "styled-components";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContexts";

const HeaderRight = ({ page }) => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, userNum } = useContext(AuthContext);
  const [userRoll, setUserRoll] = useState("");

  useEffect(() => {
    if (userNum) {
      //API 호출
      axios
        .get(`/get-userroll/${userNum}`)
        .then((userRollResponse) => {
          console.log("AAA:", userRollResponse.data);
          if (userRollResponse.status === 200) {
            setUserRoll(userRollResponse.data);
          }
        })
        .catch((error) => {
          console.error("데이터 수신 오류 :", error);
        });
    }
  }, [userNum]);

  // 마이페이지 버튼
  const myPageClick = () => {
    return navigate("/mypage"); // 로그인 페이지로 이동.
  };

  // 로그아웃 버튼
  const logoutClick = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await axios.get("/logout");
        setLoggedIn(false);
        window.sessionStorage.clear();
        return navigate("/", { replace: true }); // true: 뒤로가기 불가능 메인으로 이동.
      } catch (error) {
        console.error("로그아웃 실패 : ", error);
      }
    } else {
      return false;
    }
  };

  // 회원가입 버튼
  const joinClick = () => {
    return navigate("/join"); // 회원가입 페이지로 이동.
  };

  // 로그인 버튼
  const loginClick = () => {
    return navigate("/login"); // 로그인 페이지로 이동.
  };

  // 관리자 페이지 버튼
  const adminClick = () => {
    return navigate("/a"); // 관리자 페이지로 이동.
  };

  // 로그인 상태일때
  if (loggedIn === true) {
    if (userRoll === "Admin") {
      return (
        <HeadrRight className="headright">
          <Stack className="stack" spacing={2} direction="row">
            <Button
              onClick={logoutClick}
              variant="outlined"
              size="large"
              sx={{
                m: 1,
                minWidth: "100",
                color: "#FFFFFF",
                background: "#FF8282",
                borderColor: "#FF8282",
                ":hover": { borderColor: "#B25B5B", background: "#B25B5B" },
              }}
            >
              로그아웃
            </Button>
            <Button
              onClick={adminClick}
              variant="outlined"
              size="large"
              sx={{
                m: 1,
                color: "#FFFFFF",
                background: "#5DADE2",
                borderColor: "#5DADE2",
                ":hover": { borderColor: "#2E6DD1", background: "#2E6DD1" },
              }}
            >
              {" "}
              관리자페이지{" "}
            </Button>
          </Stack>
        </HeadrRight>
      );
    } else {
      return (
        <HeadrRight className="headright">
          <Stack className="stack" spacing={2} direction="row">
            <Button
              onClick={logoutClick}
              variant="outlined"
              size="large"
              sx={{
                m: 1,
                minWidth: "100",
                color: "#FFFFFF",
                background: "#FF8282",
                borderColor: "#FF8282",
                ":hover": { borderColor: "#B25B5B", background: "#B25B5B" },
              }}
            >
              로그아웃
            </Button>
            <Button
              onClick={myPageClick}
              variant="outlined"
              size="large"
              sx={{
                m: 1,
                color: "#FFFFFF",
                background: "#FBD385",
                borderColor: "#FBD385",
                ":hover": { borderColor: "#AF935D", background: "#AF935D" },
              }}
            >
              {" "}
              마이페이지{" "}
            </Button>
          </Stack>
        </HeadrRight>
      );
    }
  }

  // 로그아웃 상태일때
  else {
    return (
      <HeadrRight className="headright">
        <Stack className="stack" spacing={2} direction="row">
          <Button
            onClick={joinClick}
            variant="outlined"
            size="large"
            sx={{
              m: 1,
              color: "#FFFFFF",
              minWidth: "100",
              background: "#BFBFBF",
              borderColor: "#BFBFBF",
              ":hover": { borderColor: "#858585", background: "#858585" },
            }}
          >
            회원가입
          </Button>
          <Button
            onClick={loginClick}
            variant="outlined"
            size="large"
            sx={{
              m: 1,
              color: "#FFFFFF",
              background: "#FBD385",
              borderColor: "#FBD385",
              ":hover": { borderColor: "#AF935D", background: "#AF935D" },
            }}
          >
            로그인
          </Button>
        </Stack>
      </HeadrRight>
    );
  }
};

const HeadrRight = styled.div`
  .stack {
    width: 25vw;
    min-width: 300px;
    padding-top: 15px;
    align-items: center;
    justify-content: center;
    flex-direction: row-reverse;
  }
`;

export default HeaderRight;
