import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { MYPAGE } from "../../constants/PageURL";
import axios from "axios";
import { Avatar } from "@mui/material";

const MyPageNav = () => {
  const [member, setMember] = useState({
    memberNum: null,
    memberNickname: "",
    memberImg: "",
  });

  useState(() => {
    if (member.memberNum === null) {
      axios.get("/mypage/getNavInfo").then((response) => {
        if (response.data) {
          const newMember = {
            memberNum: response.data.memberNum,
            memberNickname: response.data.memberNickname,
            memberImg: response.data.memberImg,
          };
          setMember(newMember);
        }
      });
    }
  }, [member]);

  return (
    <MyPageNavStyle className="MyPageNav">
      <Avatar
        sx={{ width: "160px", height: "160px" }}
        className="ProfileImg"
        src={member.memberImg}
        alt="profile"
        style={{ borderRadius: "50%" }}
      />
      <NickName>{member.memberNickname}</NickName>
      <NavList
        title={"My Page"}
        navList={[
          { linkName: "회원 정보", link: MYPAGE.INFO },
          { linkName: "주문 내역", link: MYPAGE.ORDERLIST },
        ]}
      />
      <NavList
        title={"입양 관리"}
        navList={[
          { linkName: "입양 후기", link: MYPAGE.ADOPT_REVIEW },
          { linkName: "입양 내역", link: MYPAGE.ADOPTLIST }, // 페이지 없음
        ]}
      />
      <NavList
        title={"쓴 글 목록"}
        navList={[
          {
            linkName: "실종 동물 게시판",
            link: MYPAGE.BOARD_MISSING,
          }, // 페이지 없음
          {
            linkName: "목격 제보 게시판",
            link: MYPAGE.BOARD_FIND,
          }, // 페이지 없음
          { linkName: "자유게시판", link: MYPAGE.BOARD_FREE }, // 페이지 없음
          { linkName: "봉사 후기", link: MYPAGE.BOARD_VOLUNTEER }, // 페이지 없음
          { linkName: "매매 장터", link: MYPAGE.BOARD_FLEA }, // 페이지 없음
        ]}
      />
      <NavList
        title={"문의하기"}
        navList={[
          { linkName: "1:1 문의하기", link: MYPAGE.QNA }, // 페이지 없음
        ]}
      />
    </MyPageNavStyle>
  );
};

const NavList = ({ title, navList }) => {
  const [selected, setSelected] = useState("");
  const [height, setHeight] = useState(0);
  const [fixed, setFixed] = useState("");
  const location = useLocation();
  const [lastLocation, setLastLocation] = useState("");

  useEffect(() => {
    if (lastLocation !== location.pathname) {
      // 페이지 전환이 발생한 경우
      setFixed("");
      setLastLocation(location.pathname); // 최근 위치 state 갱신신
    } else if (
      lastLocation === location.pathname && // 최근 위치 업데이트 됨
      fixed === "" && // 메뉴 카테고리 고정 초기화 됨
      navList.some((link) => link.link === lastLocation) // 링크들 중에 현재 위치와 일치하는 링크를 찾음
    ) {
      setFixed(title); // state값으로 title을 저장하여 현재 카테고리에 메뉴가 열려있도록 고정 (select값에 상관없이 열려있게 함)
      const ulHeight = ulRef.current.scrollHeight; // 링크들이 들어있는 <ul>의 높이를 구함
      setHeight(ulHeight); // <ul>의 높이를 state로 저장
    }
  }, [location, lastLocation, fixed]);

  const ulRef = useRef(null);

  const HandleMouseOver = () => {
    const ulHeight = ulRef.current.scrollHeight; // useRef를 이용하여 <ul>의 높이를 가져옴
    setHeight(ulHeight); // 가져온 높이를 상태변수에 저장
    setSelected(title); // 해당 메뉴 카테고리가 선택되었음을 state로 저장
  };

  const HandleMouseOut = () => {
    setSelected("");
  };

  return (
    <NavListStyle
      onMouseOver={HandleMouseOver}
      onMouseOut={HandleMouseOut}
      isSelected={selected === title} // 현재 title이 선택되었는지 판단
      isFixed={fixed === title} // 현재 title이 고정되었는지 판단
      height={height} //ref로 구한 <ul>태그의 높이
    >
      <div className="NavTitle">{title}</div>
      <ul ref={ulRef}>
        {navList.map((link, index) => {
          return link.link === location.pathname ? (
            <li key={index}>
              <Link to={link.link} style={{ fontWeight: "bold" }}>
                {link.linkName}
              </Link>
            </li>
          ) : (
            <li key={index}>
              <Link to={link.link}>{link.linkName}</Link>
            </li>
          );
        })}
      </ul>
    </NavListStyle>
  );
};

const NickName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 36px;
  margin-top: 5px;
  text-decoration-line: underline;
  text-decoration-color: #ffbd59;
  text-underline-offset: 5px; /* 밑줄과 텍스트의 간격 조절 */
`;

const MyPageNavStyle = styled.div`
  width: 160px;
  text-align: center;

  .NavTitle {
    margin-top: 20px;
  }
`;

const NavListStyle = styled.div`
  width: 160px;
  .NavTitle {
    width: 160px;
    height: 40px;
    // background: rgba(251, 211, 133, 0.58);
    background: #fbd385;
    border: 1px solid #ffbd59;
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 36px;
    z-index: 0;
    cursor: default;
  }

  ul {
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    overflow: hidden;
    height: ${(props) =>
      props.isFixed || props.isSelected ? props.height + "px" : 0};
    transition: height 0.5s ease-in-out;
    z-index: -1;
  }

  li {
    height: 40px;
    border-bottom: 2px solid #ffbd59;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  li > a {
    color: black;
    text-decoration: none;
    font-weight: 400;
    font-size: 1.2rem;
  }
`;

const member = {
  num: 1,
  id: "PetLove",
  pw: "12345678",
  nickname: "봉천동물주먹",
  email: "asdf@naver.com",
  name: "이기자",
  gender: "남자",
  birth: "2023-01-01",
  tel: "010-1234-5678",
  addr: "서울특별시 강남구 선릉로 428",
  img: "",
  role: "user",
};

export default MyPageNav;
