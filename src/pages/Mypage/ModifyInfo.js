import { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Badge,
  Fab,
  FormHelperText,
  ThemeProvider,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { CustomTheme } from "../../assets/Theme/CustomTheme";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ModifyInfo() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [Image, setImage] = useState("/images/emptyProfile.png");
  const [file, setFile] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPwError, setConfirmPwError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [nickAble, setNickAble] = useState(false);
  const [pwAble, setPwAble] = useState(false);
  const [confirmAble, setConfirmAble] = useState(false);
  const [emailAble, setEmailAble] = useState(false);
  const [phoneAble, setPhoneAble] = useState(false);
  const [checkAble, setCheckAble] = useState(false);
  const [imgAble, setImageAble] = useState(false);

  const fileInput = useRef(null);
  const nickRef = useRef();
  const passRef = useRef();
  const confirmRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();

  const location = useLocation();
  const memberNum = location.state.num;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/memberInfo/${memberNum}`
        );
        const data = response.data;
        console.log(response);
        setNickname(data.memberNickname);
        setEmail(data.memberEmail);
        setPhone(data.memberTel);
        setImage(data.memberImg);
        setNickAble(true);
        setEmailAble(true);
        setPhoneAble(true);
        setImageAble(true);
      } catch (error) {
        console.error("Error fetching data : ", error);
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 닉네임
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNicknameError("2글자 이상 5글자 미만으로 입력해주세요.");
      setNickAble(false);
    } else {
      setNicknameError("");
      setNickAble(true);
    }
  };

  // 비밀번호
  const onChangePassword = (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/;
    const passwordCurrent = e.target.value;
    setPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordError("숫자+영문자 조합으로 8~20자리로 입력해주세요!");
      setPwAble(false);
    } else {
      setPasswordError("");
      setPwAble(true);
      setCheckAble(true);
    }
  };

  // 비밀번호 확인
  const onChangePasswordConfirm = (e) => {
    const passwordConfirmCurrent = e.target.value;
    setConfirmPw(passwordConfirmCurrent);

    if (password === passwordConfirmCurrent) {
      setConfirmPwError("");
      setConfirmAble(true);
      setCheckAble(true);
    } else {
      setConfirmPwError("비밀번호가 일치하지 않습니다.");
      setConfirmAble(false);
    }
  };

  // 이메일
  const onChangeEmail = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegex.test(emailCurrent)) {
      setEmailError("이메일 형식을 다시 확인해주세요.");
      setEmailAble(false);
    } else {
      setEmailError("");
      setEmailAble(true);
    }
  };

  // 전화번호
  const onChangePhone = (e) => {
    const input = e.target.value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, `$1-$2-$3`)
      .replace(/-{1,2}$/g, "");
    setPhone(input);
    const regPhone = /^\d{3}-\d{4}-\d{4}$/;
    if (!regPhone.test(input)) {
      setPhoneError("전화번호 형식을 확인해주세요.");
      setPhoneAble(false);
    } else {
      setPhoneError("");
      setPhoneAble(true);
    }
  };

  //이미지 파일
  const onChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      //업로드 취소할 시
      setImage("/images/emptyProfile.png");
      return;
    }
    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  // const [previewUrl, setPreviewUrl] = useState(null);
  // const onChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setPreviewUrl(event.target.result);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // };
  //이미지 업로드
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData);
      const imageUrl = response.data;
      return imageUrl;
    } catch (error) {
      console.error("이미지 업로드 실패 : ", error);
      return null;
    }
  };

  //엔터 키 이벤트
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "nickname" && passRef.current) {
        passRef.current.focus();
      } else if (e.target.name === "pw" && confirmRef.current) {
        confirmRef.current.focus();
      } else if (e.target.name === "confirmPw" && emailRef.current) {
        emailRef.current.focus();
      } else if (e.target.name === "email" && phoneRef.current) {
        phoneRef.current.focus();
      }
    }
  };

  //수정 전 마지막 항목 엔터키 이벤트
  const checkenterSubmit = (e) => {
    if (e.key === "Enter") {
      submitCheck();
    }
  };

  //submitCheck
  const submitCheck = () => {
    if (!nickname) {
      setNicknameError("닉네임을 확인해주세요.");
    }
    if (!password) {
      setPasswordError("패스워드를 입력해주세요.");
    }
    if (!confirmPw) {
      setConfirmPwError("패스워드 확인을 입력해주세요.");
    }
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
    }
    if (!phone) {
      setPhoneError("전화번호를 입력해주세요.");
    }
  };

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //닉네임, 이메일, 전화번호 중복체크
    try {
      const response = await axios.post("/updateValid", {
        memberNum: memberNum,
        memberNickname: nickname,
        memberEmail: email,
        memberTel: phone,
      });
      const { data } = response;
      console.log(data);
      if (data === 1) {
        setNicknameError("이미 사용중인 닉네임입니다.");
        nickRef.current = "";
        setNickAble(false);
        return;
      } else if (data === 2) {
        setEmailError("이미 사용중인 이메일입니다.");
        emailRef.current = "";
        setEmailAble(false);
        return;
      } else if (data === 3) {
        setPhoneError("이미 사용중인 전화번호입니다.");
        phoneRef.current = "";
        setPhoneAble(false);
        return;
      } else if (data === 0) {
        setNickAble(true);
        setEmailAble(true);
        setPhoneAble(true);
        setEmailError("");
        setPhoneError("");
        setNicknameError("");
      }
    } catch (err) {
      console.log("Error >>", err);
    }
    //이미지 업로드
    let imageUrl = Image;
    //"https://via.placeholder.com/150";
    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }
    //유효성검사 통과 시 수정 폼 submit
    console.log(nickAble, pwAble, confirmAble, emailAble, phoneAble, checkAble);
    if (
      !nickAble ||
      !pwAble ||
      !confirmAble ||
      !emailAble ||
      !phoneAble ||
      !checkAble
    ) {
      console.log("요청 실패");
      return;
    } else {
      console.log("memberNum 수정 : ", memberNum);
      const memberData = {
        memberNickname: nickname,
        memberPw: password,
        memberEmail: email,
        memberTel: phone,
        memberImg: imageUrl,
      };

      try {
        const res = await axios.put(`/update/${memberNum}`, memberData);
        console.log(res.data);
        if (res.data) {
          alert("수정 성공");
          document.location.href = "/mypage";
        } else {
          alert("수정에 실패하셨습니다.");
        }
      } catch (err) {
        console.log("Error >>", err);
      }

      console.log(`submit->${nickname},${password},${email},${phone},${Image}`);
    }
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Container component="main" sx={{ width: "50vw" }}>
        <Box
          component="form"
          validate="true"
          onSubmit={handleSubmit}
          sx={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold">
            회원 정보 수정
          </Typography>
          <br />
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Fab
                aria-label="edit"
                size="small"
                onClick={() => {
                  fileInput.current.click();
                }}
              >
                <CameraAltIcon />
              </Fab>
            }
          >
            <Avatar src={Image} sx={{ width: 150, height: 150 }} />
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/jpg,impge/png,image/jpeg"
              name="profile_img"
              onChange={onChange}
              ref={fileInput}
            />
          </Badge>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="nickname"
                  label="닉네임"
                  type="nickname"
                  autoComplete="off"
                  onChange={onChangeNickname}
                  value={nickname || ""}
                  ref={nickRef}
                  onKeyPress={handleKeyPress}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {nicknameError}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="pw"
                  id="pw"
                  label="비밀번호"
                  type="password"
                  autoComplete="off"
                  onChange={onChangePassword}
                  value={password || ""}
                  ref={passRef}
                  onKeyPress={handleKeyPress}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {passwordError}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPw"
                  label="비밀번호 확인"
                  type="password"
                  autoComplete="off"
                  value={confirmPw || ""}
                  onChange={onChangePasswordConfirm}
                  ref={confirmRef}
                  onKeyPress={handleKeyPress}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {confirmPwError}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="이메일"
                  name="email"
                  autoComplete="email"
                  onChange={onChangeEmail}
                  value={email || ""}
                  ref={emailRef}
                  onKeyPress={handleKeyPress}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {emailError}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="전화번호"
                  name="phone"
                  autoComplete="phone"
                  onChange={onChangePhone}
                  inputProps={{ maxLength: 13 }}
                  InputProps={{
                    inputMode: "numeric",
                  }}
                  value={phone || ""}
                  ref={phoneRef}
                  onKeyPress={checkenterSubmit}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {phoneError}
                </FormHelperText>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 1,
                height: "50px",
              }}
              color="primary"
              onClick={submitCheck}
            >
              <Typography component="h1" variant="h6" color="white">
                수정
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ModifyInfo;
