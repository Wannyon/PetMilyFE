import React, { useEffect, useLayoutEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CustomButton from "../Login/CustomButton";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { CustomTheme } from "../../assets/Theme/CustomTheme";
import CallIcon from "@mui/icons-material/Call";
const { kakao } = window;
let curLatitude = "";
let curLongitude = "";
const HospitalLocation = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("");
  const [data, setData] = useState("");
  const [dragend, setDragend] = useState(false);
  const [usefirst, setUseFirst] = useState(false);
  const [item, setItem] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: curLatitude,
    longtitude: curLongitude,
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const handleLeave = () => {
    setHoveredIndex(null);
  };

  function getLocation() {
    if (navigator.geolocation) {
      // GPS를 지원하면
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("position.coords" + position.coords);
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });
          curLatitude = position.coords.latitude;
          curLongitude = position.coords.longitude;

          setData("1");
        },
        function (error) {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    } else {
      alert("GPS를 지원하지 않습니다");
    }
  }

  useLayoutEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    console.log("current1 " + curLatitude + " " + curLongitude);
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(curLatitude, curLongitude),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    // map.setZoomable(false); //줌 막기
    // 장소 검색 객체를 생성
    const ps = new kakao.maps.services.Places();

    if (place === "") {
      ps.keywordSearch("동물병원", placesSearchCB, {
        location: new kakao.maps.LatLng(curLatitude, curLongitude),
      });
    } else {
      ps.keywordSearch(place, placesSearchCB);
    }
    function getCenter() {
      kakao.map.event.addListener(map, "dragend", function () {
        setDragend(!dragend);
        var latlng = map.getCenter();
        const latitude = latlng.getLat;
        const longitude = latlng.getLng;
        setCurrentPosition({ latitude, longitude });
        curLatitude = latlng.getLat;
        curLongitude = latlng.getLat;
      });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가
        let bounds = new kakao.maps.LatLngBounds();
        setItem(data);
        for (let i = 0; i < data.length - 1; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정
        map.setBounds(bounds);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    }

    // 지도에 마커를 표시하는 함수
    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시

      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 마커에 클릭이벤트를 등록
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출
        infowindow.close();
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;text-align:center;">' +
            place.place_name +
            "</div>"
        );

        infowindow.open(map, marker);
      });
    }

    // getCenter();
  }, [place, data, dragend]);
  console.log(item);
  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <h1
            sx={{
              color: "black",
              mt: "30px",
              mb: "30px",
              fontSize: "70px",
              fontWeight: "bord",
            }}
          >
            동물병원 정보
          </h1>
          <img
            alt="hospital"
            style={{
              width: "60px",
              height: "50px",
              marginLeft: "10px",
              marginBottom: "15px",
            }}
            src="./../images/hop.png"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            sx={{
              background: "white",
              width: "300px",
              marginRight: "10px",
            }}
            InputProps={{
              style: {
                height: "35px",
              },
            }}
            type="text"
            name="searchHospital"
            variant="outlined"
            value={inputText}
            onChange={onChange}
            placeholder="가까운 동물병원을 검색해보세요!"
          />
          <CustomButton
            type="submit"
            label="검색"
            value="병원검색"
            onClick={handleSubmit}
          ></CustomButton>
        </div>
        <div
          id="map"
          style={{
            marginTop: "20px",
            border: "solid 1px ",
            width: "1000px",
            height: "500px",
          }}
        ></div>
        <Box
          sx={{ marginTop: "30px", marginLeft: "16px", marginBottom: "60px" }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              width: "1000px",
            }}
          >
            {item.slice(0, -1).map((item, index) => (
              <Grid
                item
                xs={6}
                key={item.place_name}
                sx={{
                  textAlign: "left",

                  border: "0.5px solid",
                  borderRightWidth:
                    index % 2 === 0
                      ? index === item.length - 1
                        ? 0
                        : "0.5px"
                      : "0.5px",
                  borderLeftWidth: index % 2 === 0 ? "0.5px" : 0,
                  borderBottomWidth: "0.5px",
                  borderTopWidth: index > 1 ? 0 : "0.5px",
                }}
              >
                {hoveredIndex === index ? (
                  <h3
                    style={{
                      lineHeight: "25px",
                      transition: "all 0.3s ease-out",
                      color: "#FBD385",
                      cursor: "pointer",
                      transform: "scale(1.05)",
                    }}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={handleLeave}
                    onClick={() => {
                      window.open(item.place_url);
                    }}
                  >
                    {index + 1}. {item.place_name}
                  </h3>
                ) : (
                  <h3
                    style={{
                      lineHeight: "25px",
                      transition: "all 0.3s ease-out",

                      cursor: "pointer",
                      transform: "scale(1.0)",
                    }}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={handleLeave}
                    onClick={() => {
                      window.open(item.place_url);
                    }}
                  >
                    {index + 1}. {item.place_name}
                  </h3>
                )}

                <h5
                  class="tel"
                  style={{
                    fontSize: "small",
                    color: "gray",
                    marginLeft: "20px",
                    marginTop: "-5px",
                  }}
                >
                  ☎️ {item.phone ? item.phone : "등록된 번호가 없습니다."}
                </h5>
                <h5
                  class="tel"
                  style={{
                    fontSize: "medium",
                    color: "gray",
                    marginTop: "-5px",
                    marginLeft: "20px",
                  }}
                >
                  지번 주소: {item.address_name}
                </h5>
                <h5
                  class="tel"
                  style={{
                    fontSize: "medium",
                    color: "gray",
                    marginTop: "-20px",
                    marginLeft: "20px",
                  }}
                >
                  도로명 주소: {item.road_address_name}
                </h5>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default HospitalLocation;
