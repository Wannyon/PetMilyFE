import {
  Avatar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
import { CustomTheme } from "../../assets/Theme/CustomTheme";
import { MYPAGE } from "../../constants/PageURL";
import axios from "axios";
function MyInfo() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get("/mypage/getInfo")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("에러발생:", error));
  }, []);

  const gender = (value) => {
    if (value === "male") return "남자";
    if (value === "female") return "여자";
  };
  // const columnWidth = 100;
  return (
    <ThemeProvider theme={CustomTheme}>
      <Typography
        className="myOrderListTitle"
        sx={titleSx}
        border={3}
        borderColor="#ffbd59"
        mb={4}
      >
        회원 정보
      </Typography>
      <Box
        p={2}
        border={3}
        borderRadius={2}
        borderColor="fbd385.main"
        fontStyle={"h1"}
        mt={4}
        mb={4}
      >
        <Box minWidth={"400px"} display={"flex"} justifyContent={"center"}>
          <Table
            size="small"
            padding="normal"
            sx={{ borderBottomColor: "fbd385.main", width: "400px" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{
                    borderBottom: "unset",
                  }}
                >
                  <Box display={"flex"} justifyContent={"center"} m={4}>
                    <Avatar
                      alt="profile"
                      src={data && data.memberImg}
                      sx={{ width: 200, height: 200 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={thSx}>ID</TableCell>
                <TableCell sx={tdSx}>{data && data.memberId}</TableCell>
              </TableRow>
              {/* <TableRow>
                <TableCell sx={thSx}>PW</TableCell>
                <TableCell sx={tdSx}>{data && "*".repeat(data.memberPw)}</TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell sx={thSx}>이름</TableCell>
                <TableCell sx={tdSx}>{data && data.memberName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={thSx}>성별</TableCell>
                <TableCell sx={tdSx}>
                  {data && gender(data.memberGender)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={thSx}>생일</TableCell>
                <TableCell sx={tdSx}>{data && data.memberBirth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={thSx}>연락처</TableCell>
                <TableCell sx={tdSx}>{data && data.memberTel}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={thSx}>이메일</TableCell>
                <TableCell sx={tdSx}>{data && data.memberEmail}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{ m: 2, width: "100px" }}
            onClick={() =>
              navigate(MYPAGE.MODIFY_INFO, { state: { num: data.memberNum } })
            }
          >
            수정
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
const titleSx = {
  width: "200px",
  textAlign: "center",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "1.5rem",
  lineHeight: "50px",
};
const thSx = {
  fontWeight: "bold",
  fontSize: "1.2rem",
  lineHeight: "50px",
  borderBottom: "1px solid #fbd385",
  width: "100px",
};
const tdSx = {
  fontWeight: "400",
  fontSize: "1.2rem",
  lineHeight: "50px",
  borderBottom: "1px solid #fbd385",
};

export default MyInfo;
