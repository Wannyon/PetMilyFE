import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./DonateApply.styled";
import { TextField, ThemeProvider } from "@mui/material";
import Button from "@mui/material/Button";
import DonateApplyComplete from "./DonateApplyComplete";
import { CustomTheme } from "../../assets/Theme/CustomTheme";
import axios from "axios";
import Donate from "./Donate";
import { SUPPORT } from "../../constants/PageURL";

const DonateApply = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [donationCompleted, setDonationCompleted] = useState(false); //danateApplyComplete 렌더함수
  const [donationDate, setDonationDate] = useState("");
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState(""); //원화 표시 상태
  const [paymentMethod, setPaymentMethod] = useState("");
  const [donor, setDonor] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const reset = () => {
    // 결제 실패시 상태 초기화
    setDonationCompleted(false);
    setIsSuccess(false);
    setErrorMsg("");
  };

  // <--입력값 유효성 검사
  const [donorErrorMsg, setDonorErrorMsg] = useState("");
  const [amountErrorMsg, setAmountErrorMsg] = useState("");
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [telErrorMsg, setTelErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const isDonorValid = () => donor !== "";
  const isAmountValid = () => amount !== "";
  const isNameValid = () => validateName(name);
  const isTelValid = () => validateTel(tel);
  const isEmailValid = () => validateEmail(email);
  // -->

  const validateName = (name) => {
    return name.length >= 2;
  };

  //이메일 검증 로직
  const validateEmail = (email) => {
    const emailValue = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;
    return emailValue.test(email);
  };
  //전화번호 검증 로직
  const validateTel = (tel) => {
    const telValue = /^\d{3}-\d{4}-\d{4}$/;
    return telValue.test(tel);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!validateName(newName)) {
      setNameErrorMsg("올바른 이름을 입력해주세요.");
    } else {
      setNameErrorMsg("");
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailErrorMsg("올바른 이메일을 입력해주세요.");
    } else {
      setEmailErrorMsg("");
    }
  };

  const handleTelChange = (e) => {
    const newTel = e.target.value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, `$1-$2-$3`)
      .replace(/-{1,2}$/g, "");
    setTel(newTel);
    if (!validateTel(newTel)) {
      setTelErrorMsg("올바른 전화번호를 입력해주세요.");
    } else {
      setTelErrorMsg("");
    }
  };

  useEffect(() => {
    // 기본 결제 수단을 신용카드로 설정
    setPaymentMethod("신용카드");
  }, []);

  function onClickPayment() {
    //아임포트 NHN kpc pg사 api 연동
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    const merchant_uid = `DONATION-C-${Date.now()}`;
    IMP.init("imp83178746");
    const data = {
      //결제 데이터 정의하기
      pg: "kcp",
      pay_method: "card",
      merchant_uid: merchant_uid,
      name: "펫밀리 기부",
      amount: amount,
      buyer_email: email,
      buyer_name: name,
      buyer_tel: tel,
      // buyer_addr: "서울특별시 강남구 신사동",
      // buyer_postcode: "01181",
    };
    IMP.request_pay(data, callback);
  }

  function callback(response) {
    //콜백함수 정의하기
    const { success, merchant_uid, imp_uid, error_msg } = response;

    if (success) {
      const currentDate = new Date();
      const isoCurrentDate = new Date(
        currentDate.getTime() + 9 * 60 * 60 * 1000
      ).toISOString();
      axios
        .post("/donate/apply", {
          donationDto: {
            donationDonor: donor,
            donationName: name,
            donationTel: tel,
            donationEmail: email,
            donationCost: amount,
            donationDate: isoCurrentDate,
          },
          paymentDto: {
            merchantUid: merchant_uid,
            impUid: imp_uid,
            paymentState: "결제완료",
            amount: amount,
            paymentDate: isoCurrentDate,
          },
        })
        .then((response) => {
          console.log(response.data);
          setDonationDate(isoCurrentDate);
          setDonationCompleted(true);
          setIsSuccess(true);
        })
        .catch((error) => {
          console.error(error);
          setErrorMsg(error_msg);
          setDonationCompleted(true);
          setIsSuccess(false);
        });
    } else {
      // alert(`결제 실패: ${error_msg}`);
      setErrorMsg(error_msg);
      setDonationCompleted(true);
      setIsSuccess(false);
      window.scrollTo(0, 0);
    }
  }

  function onClickKAKAOPayment() {
    //아임포트 카카오페이 pg사 api 연동
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp83178746");
    const merchant_uid = `DONATION-K-${Date.now()}`;
    const data = {
      //결제 데이터 정의하기
      pg: "kakaopay.TC0ONETIME",
      pay_method: "card",
      merchant_uid: merchant_uid,
      name: "펫밀리 기부",
      amount: amount,
      buyer_email: email,
      buyer_name: name,
      buyer_tel: tel,
    };
    IMP.request_pay(data, callback);
  }

  function onClickVbankPayment() {
    //아임포트 nice pg사 api 연동
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    const merchant_uid = `DONATION-V-${Date.now()}`;
    IMP.init("imp83178746");
    const data = {
      //결제 데이터 정의하기
      pg: "nice",
      pay_method: "trans",
      merchant_uid: merchant_uid,
      name: "펫밀리 기부",
      amount: amount,
      buyer_email: email,
      buyer_name: name,
      buyer_tel: tel,
    };
    IMP.request_pay(data, callback);
  }

  const handleAmountChange = (e) => {
    // 입력할때 이벤트 추가
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) {
      return; // 입력값이 10자리를 초과하면, 입력 중단.
    }
    const formattedValue =
      value === "" ? "" : Number(value).toLocaleString("ko-KR"); //기부 금액 부분 원으로 표시
    setAmount(Number(value));
    setFormattedAmount(formattedValue);

    if (isAmountValid(Number(value))) {
      setAmountErrorMsg("");
    } else {
      setAmountErrorMsg("기부 금액을 입력해주세요.");
    }
  };

  const paymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleCancel = () => {
    //input 초기화
    setAmount("");
    setFormattedAmount("");
    setDonor("");
    setPaymentMethod("신용카드");
    setName("");
    setTel("");
    setEmail("");
    setDonorErrorMsg("");
    setAmountErrorMsg("");
    setNameErrorMsg("");
    setTelErrorMsg("");
    setEmailErrorMsg("");
    setErrorMsg("");
    navigate(SUPPORT.DONATE);
    window.scrollTo(0, 0);
  };

  const validateForm = () => {
    //에러메세지 띄우기
    let isValid = true;

    if (!isDonorValid()) {
      setDonorErrorMsg("기부명을 입력해주세요.");
      isValid = false;
    } else {
      setDonorErrorMsg("");
    }

    if (!isAmountValid()) {
      setAmountErrorMsg("기부 금액을 입력해주세요.");
      isValid = false;
    } else {
      setAmountErrorMsg("");
    }

    if (!isNameValid()) {
      setNameErrorMsg("올바른 이름을 입력해주세요.");
      isValid = false;
    } else {
      setNameErrorMsg("");
    }

    if (!isTelValid()) {
      setTelErrorMsg("올바른 전화번호를 입력해주세요.");
      isValid = false;
    } else {
      setTelErrorMsg("");
    }

    if (!isEmailValid()) {
      setEmailErrorMsg("올바른 이메일을 입력해주세요.");
      isValid = false;
    } else {
      setEmailErrorMsg("");
    }

    return isValid;
  };

  const handlePayment = () => {
    if (validateForm()) {
      setErrorMsg("");
      if (paymentMethod === "신용카드") {
        onClickPayment();
      } else if (paymentMethod === "카카오페이") {
        onClickKAKAOPayment();
      } else if (paymentMethod === "계좌이체") {
        onClickVbankPayment();
      }
    }
  };

  if (donationCompleted) {
    return (
      <DonateApplyComplete
        donor={donor}
        name={name}
        amount={amount}
        donationDate={donationDate}
        isSuccess={isSuccess}
        errorMsg={errorMsg}
        reset={reset}
      />
    );
  }

  return (
    <S.Container>
      <ThemeProvider theme={CustomTheme}>
        <S.MainTitle>기부 신청</S.MainTitle>
        <S.Line />
        <S.Title>기부 정보</S.Title>
        <S.Form>
          <S.Field>
            <S.Label>
              <S.Label>기부명</S.Label>
              {donorErrorMsg && <S.ErrorMsg>&nbsp;</S.ErrorMsg>}
            </S.Label>
            <S.InputWrapper>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={donor}
                onChange={(e) => {
                  const newDonor = e.target.value;
                  setDonor(newDonor);
                  if (isDonorValid(newDonor)) {
                    setDonorErrorMsg("");
                  }
                }}
              />
              {donorErrorMsg && <S.ErrorMsg>{donorErrorMsg}</S.ErrorMsg>}
            </S.InputWrapper>
          </S.Field>

          <S.Field>
            <S.Label>
              <S.Label>기부금액</S.Label>
              {amountErrorMsg && <S.ErrorMsg>&nbsp;</S.ErrorMsg>}
            </S.Label>
            <S.InputWrapper>
              <TextField
                variant="outlined"
                size="small"
                value={formattedAmount}
                onChange={handleAmountChange}
                InputProps={{
                  endAdornment: <S.InputAdornment>원</S.InputAdornment>,
                }}
              />
              {amountErrorMsg && <S.ErrorMsg>{amountErrorMsg}</S.ErrorMsg>}
            </S.InputWrapper>
          </S.Field>
          <S.Title>기본 정보</S.Title>
          <S.Field>
            <S.Label>
              <S.Label>이름</S.Label>
              {nameErrorMsg && <S.ErrorMsg>&nbsp;</S.ErrorMsg>}
            </S.Label>
            <S.InputWrapper>
              <TextField
                variant="outlined"
                size="small"
                value={name}
                onChange={handleNameChange}
              />
              {nameErrorMsg && <S.ErrorMsg>{nameErrorMsg}</S.ErrorMsg>}
            </S.InputWrapper>
          </S.Field>

          <S.Field>
            <S.Label>
              <S.Label>전화번호</S.Label>
              {telErrorMsg && <S.ErrorMsg>&nbsp;</S.ErrorMsg>}
            </S.Label>
            <S.InputWrapper>
              <TextField
                variant="outlined"
                size="small"
                placeholder="010-0000-0000"
                value={tel}
                onChange={handleTelChange}
                inputProps={{ maxLength: 13, pattern: "[0-9]*" }}
                InputProps={{
                  inputMode: "numeric",
                }}
              />
              {telErrorMsg && <S.ErrorMsg>{telErrorMsg}</S.ErrorMsg>}
            </S.InputWrapper>
          </S.Field>
          <S.Field>
            <S.Label>
              <S.Label>이메일</S.Label>
              {emailErrorMsg && <S.ErrorMsg>&nbsp;</S.ErrorMsg>}
            </S.Label>
            <S.InputWrapper>
              <TextField
                variant="outlined"
                size="small"
                value={email}
                // onChange={(e) => setEmail(e.target.value)}
                onChange={handleEmailChange}
              />
              {emailErrorMsg && <S.ErrorMsg>{emailErrorMsg}</S.ErrorMsg>}
            </S.InputWrapper>
          </S.Field>

          <S.Title>결제 정보</S.Title>
          <S.Field>
            <S.PayLabel>결제 수단</S.PayLabel>
            <S.PaymentButtons>
              <Button
                variant={
                  paymentMethod === "신용카드" ? "contained" : "outlined"
                }
                onClick={() => paymentSelect("신용카드")}
                sx={{
                  borderColor: "#FBD385",
                  color: paymentMethod === "신용카드" ? "#FFFFFF" : "#FBD385",
                  backgroundColor:
                    paymentMethod === "신용카드" ? "#FBD385" : "",
                  ":hover": {
                    borderColor: "#FBD385",
                    backgroundColor: "#AF935D",
                    color: "#FFFFFF",
                  },
                }}
              >
                신용카드
              </Button>
              <Button
                variant={
                  paymentMethod === "계좌이체" ? "contained" : "outlined"
                }
                onClick={() => paymentSelect("계좌이체")}
                sx={{
                  borderColor: "#FBD385",
                  color: paymentMethod === "계좌이체" ? "#FFFFFF" : "#FBD385",
                  backgroundColor:
                    paymentMethod === "계좌이체" ? "#FBD385" : "",
                  ":hover": {
                    borderColor: "#FBD385",
                    backgroundColor: "#AF935D",
                    color: "#FFFFFF",
                  },
                }}
              >
                계좌이체
              </Button>
              <Button
                variant={
                  paymentMethod === "카카오페이" ? "contained" : "outlined"
                }
                size="small"
                onClick={() => paymentSelect("카카오페이")}
                sx={{
                  borderColor: "#FBD385",
                  color: paymentMethod === "카카오페이" ? "#FFFFFF" : "#FBD385",
                  backgroundColor:
                    paymentMethod === "카카오페이" ? "#FBD385" : "",
                  ":hover": {
                    borderColor: "#FBD385",
                    backgroundColor: "#AF935D",
                    color: "#FFFFFF",
                  },
                }}
              >
                카카오페이
              </Button>
            </S.PaymentButtons>
          </S.Field>
        </S.Form>
        <S.ButtonGroup>
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#FBD385",
              fontWeight: "bold",
            }}
            onClick={handlePayment}
          >
            신청
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleCancel}
            style={{
              backgroundColor: "white",
              color: "#FBD385",
              fontWeight: "bold",
            }}
          >
            취소
          </Button>
        </S.ButtonGroup>
      </ThemeProvider>
    </S.Container>
  );
};

export default DonateApply;
