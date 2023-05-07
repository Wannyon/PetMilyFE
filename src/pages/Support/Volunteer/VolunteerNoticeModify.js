import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import Loading from "../../../components/Loading/LoadingPage";
import axios from "axios";
import * as S from "./VolunteerNoticeModify.styled";
import dayjs from "dayjs";
import {
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { CustomDatePicker } from "../../../components/common/CustomDatePicker";
import { SUPPORT } from "../../../constants/PageURL";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const VolunteerNoticeModify = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [volunteerStartPeriod, setVolunteerStartPeriod] = useState(null);
  const [volunteerEndPeriod, setVolunteerEndPeriod] = useState(null);
  const [title, setTitle] = useState("");
  const [ageLimit, setAgeLimit] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [recruitmentNumber, setRecruitmentNumber] = useState("");
  const [status, setStatus] = useState("모집중");
  const [content, setContent] = useState("");
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  useEffect(() => {
    //게시글 Detail 호출
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/board/volunteer/${id}`
        ); //게시글 Detail 데이터  호출
        const data = response.data;
        setPost(data);
        setVolunteerStartPeriod(data.volunteerStartPeriod);
        setVolunteerEndPeriod(data.volunteerEndPeriod);
        setTitle(data.volunteerSubject);
        setAgeLimit(data.volunteerAge);
        setAddress(data.volunteerAddr);
        setAddressDetail(data.volunteerAddrDetail);
        setRecruitmentNumber(data.volunteerNumber);
        setStatus(data.volunteerStatus ? "모집중" : "마감");
        setContent(data.volunteerContent);
      } catch (error) {
        console.error("Error fetching data : ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 전송 로직 구현
  };

  const handleCancel = () => {
    navigate(SUPPORT.VOLUNTEER_NOTICE);
  };

  const handleAddress = (data) => {
    setAddress(data.address);
    setIsPostcodeOpen(false);
  };

  const handlePostcodeOpen = () => {
    setIsPostcodeOpen(true);
  };

  const handlePostcodeClose = () => {
    setIsPostcodeOpen(false);
  };

  const handleRecruitmentNumberChange = (e) => {
    //모집인원에 음수 입력 못하게
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setRecruitmentNumber(value);
    } else {
      setRecruitmentNumber("");
    }
  };

  if (isLoading) {
    return <Loading />; // 로딩 중일 때 표시할 컴포넌트
  }

  return (
    <>
      <S.TitleContainer>
        <S.Title>✍ 게시글 수정</S.Title>
        <Typography variant="subtitle3">봉사 모집 게시판</Typography>
      </S.TitleContainer>
      <S.Container>
        <S.FormWrapper>
          <form onSubmit={handleSubmit}>
            <S.FormRow>
              <TextField
                label="제목"
                value={title}
                size="small"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
              />
            </S.FormRow>

            <S.FormRow2>
              <CustomDatePicker
                label="활동 시작 기간"
                value={dayjs(volunteerStartPeriod)}
                sx={{
                  "& label": {
                    color: "#ccc",
                  },
                  "&:hover label": {
                    color: "#fbd385",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                  },
                }}
                onChange={(newValue) => setVolunteerStartPeriod(newValue)}
                // inputProps={{ value: volunteerStartPeriod }}
              />
              <CustomDatePicker
                label="활동 종료 기간"
                value={dayjs(volunteerEndPeriod)}
                sx={{
                  "& label": {
                    color: "#ccc",
                  },
                  "&:hover label": {
                    color: "#fbd385",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                  },
                }}
                onChange={(newValue) => setVolunteerEndPeriod(newValue)}
                // inputProps={{ value: volunteerEndPeriod }}
              />
            </S.FormRow2>

            <S.FormRow>
              <TextField
                label="주소"
                value={address}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
              <S.ButtonSpace />
              <S.WriteButton onClick={handlePostcodeOpen}>검색</S.WriteButton>
              <Dialog
                open={isPostcodeOpen}
                onClose={handlePostcodeClose}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>주소 검색</DialogTitle>
                <DialogContent>
                  {isPostcodeOpen && (
                    <DaumPostcode
                      onComplete={handleAddress}
                      autoClose={false}
                      width={592}
                      height={557}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </S.FormRow>
            <S.FormRow>
              <TextField
                label="상세 주소"
                value={addressDetail}
                fullWidth
                size="small"
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </S.FormRow>

            <S.FormRow>
              <TextField
                label="모집 인원"
                value={recruitmentNumber}
                fullWidth
                size="small"
                onChange={handleRecruitmentNumberChange}
                type="number"
              />
              &nbsp;
              <TextField
                label="나이제한"
                value={ageLimit}
                size="small"
                fullWidth
                onChange={(e) => setAgeLimit(e.target.value)}
              />
            </S.FormRow>

            <S.FormRow>
              <span>이미지 첨부</span>
              <S.CommonButton component="label">
                사진 업로드
                <input type="file" hidden />
              </S.CommonButton>
              모집 상태
              <FormControl>
                <InputLabel>상태</InputLabel>
                <Select
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="모집중">모집중</MenuItem>
                  <MenuItem value="마감">마감</MenuItem>
                </Select>
              </FormControl>
            </S.FormRow>

            <S.FormRow>
              <S.EditorWrapper>
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "indent",
                      "outdent",
                      "|",
                      "blockQuote",
                      "insertTable",
                      "mediaEmbed",
                      "undo",
                      "redo",
                    ],
                    className: "WriteEditor",
                    placeholder: "내용을 입력하세요.",
                  }}
                />
              </S.EditorWrapper>
              {/* <TextField
                label="내용"
                multiline
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
              /> */}
            </S.FormRow>

            <S.FormRow>
              <S.ButtonGroup>
                <S.WriteButton type="submit" variant="contained">
                  글쓰기
                </S.WriteButton>
                <S.ButtonSpace />
                <S.WriteButton onClick={handleCancel} variant="contained">
                  취소
                </S.WriteButton>
              </S.ButtonGroup>
            </S.FormRow>
          </form>
        </S.FormWrapper>
      </S.Container>
    </>
  );
};

export default VolunteerNoticeModify;