import React, { useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "../Support/Volunteer/VolunteerNoticeWrite.styled";
import styled from "styled-components";
import {
  TextField,
  Modal,
  Alert,
  ThemeProvider,
  FormHelperText,
  Button,
} from "@mui/material";
import { ADOPT } from "../../constants/PageURL";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { CustomTheme } from "../../assets/Theme/CustomTheme";
import axios from "axios";
import { MyCustomUploadAdapterPlugin } from "../../components/common/UploadAdapter";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AdoptReviewWrite = () => {
  const [formAble, setFormAble] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const currentDate = new Date();
  const isoCurrentDate = new Date(
    currentDate.getTime() + 9 * 60 * 60 * 1000
  ).toISOString();
  console.log("is", isoCurrentDate);

  // const dateString = isoCurrentDateTime;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [contentError, setContentError] = useState();
  const [subjectError, setSubjectError] = useState();

  // 사진 미리보기
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // const handleOpen = () => {};
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData);
      const imageUrl = response.data;
      // setUploadedImageUrl(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("이미지 업로드 실패 : ", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title && !content) {
      setSubjectError("제목을 입력해주세요");
      setContentError("내용을 입력해주세요");
    } else if (!content) {
      setSubjectError("");
      setContentError("내용을 입력해주세요");
    } else if (!title) {
      setContentError("");
      setSubjectError("제목을 입력해주세요");
    } else {
      let imageUrl = "https://via.placeholder.com/150";

      if (file) {
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      axios
        .post("/board/review/insert", {
          reviewSubject: title,
          reviewContent: content,
          imgThumbnail: imageUrl,
          reviewDate: isoCurrentDate,
        })
        .then(() => {
          // alert("등록완료");
          document.location.href = ADOPT.REVIEW;
        });
      setFormAble(true);
      setOpen(true);
    }
    // 전송 로직 구현
  };

  const handleCancel = () => {
    navigate(ADOPT.REVIEW);
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Section className="result">
        <MainContainer className="result-container">
          <Board>게시글 작성</Board>

          <S.Container>
            <ThemeProvider theme={CustomTheme}>
              <S.FormWrapper>
                <form onSubmit={handleSubmit}>
                  <FormRow>
                    <TextField
                      label="제목"
                      value={title}
                      size="small"
                      fullWidth
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </FormRow>
                  <FormHelperText sx={{ color: "red" }}>
                    {subjectError}
                  </FormHelperText>

                  <S.FormRow>
                    <S.ImageWrapper>
                      <span>이미지 첨부</span>
                      <S.CommonSpace />
                      <S.CommonButton component="label">
                        사진 업로드
                        <input type="file" hidden onChange={handleFileChange} />
                      </S.CommonButton>
                    </S.ImageWrapper>
                  </S.FormRow>
                  <S.FormRow>
                    {previewUrl && (
                      <S.PreviewWrapper>
                        <img
                          src={previewUrl}
                          alt="미리보기"
                          style={{ width: "150px" }}
                        />
                      </S.PreviewWrapper>
                    )}
                  </S.FormRow>

                  <FormRow>
                    <S.EditorWrapper>
                      <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setContent(data);
                        }}
                        config={{
                          className: "WriteEditor",
                          placeholder: "내용을 입력하세요.",
                          extraPlugins: [MyCustomUploadAdapterPlugin],
                        }}
                      />
                    </S.EditorWrapper>
                  </FormRow>
                  <FormHelperText sx={{ color: "red" }}>
                    {contentError}
                  </FormHelperText>

                  <S.FormRow>
                    <S.ButtonGroup>
                      <WriteButton
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        글쓰기
                      </WriteButton>
                      <S.ButtonSpace />
                      <ResetButton onClick={handleCancel} variant="contained">
                        취소
                      </ResetButton>
                    </S.ButtonGroup>
                  </S.FormRow>
                </form>
              </S.FormWrapper>
            </ThemeProvider>
          </S.Container>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {formAble ? (
              <Alert sx={modalStyle} severity="success">
                작성 완료!
              </Alert>
            ) : (
              <Alert sx={modalStyle} severity="success">
                작성 완료!
              </Alert>
            )}
          </Modal>
        </MainContainer>
      </Section>
    </ThemeProvider>
  );
};
export default AdoptReviewWrite;
export const FormRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
`;

const Section = styled.section`
  background: #f8f9fa;
  padding: 30px 0 40px 0;
`;

const MainContainer = styled.div`
  width: 60vw;
  // width: 1150px;
  max-width: 1150px;
  min-width: 790px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(233, 236, 239);
  border-image: initial;
  margin: 0px auto 20px;
  background: rgb(255, 255, 255);
`;
const Board = styled.h1`
  margin-top: 2vw;
  text-align: center;
`;

const WriteButton = styled(Button)`
  && {
    color: #fff;
    background-color: #fbd385;
    width: auto;
    height: 30px;
    margin-top: 10px;
    margin-left: auto;
    &:hover {
      background-color: #af935d;
    }
  }
`;

const CommonSpace = styled.div`
  width: 10px;
  height: auto;
  display: inline-block;
`;

const ButtonsSpace = styled.div`
  width: 5px;
  height: auto;
  display: inline-block;
`;

const ResetButton = styled(Button)`
  && {
    color: #fff;
    background-color: #bfbfbf;
    width: auto;
    height: 30px;
    margin-top: 10px;
    &:hover {
      background-color: #858585;
    }
  }
`;
