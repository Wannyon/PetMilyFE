import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SHOP } from "../../constants/PageURL";
import axios from "axios";
import DOMPurify from "dompurify";
import { AuthContext } from "../../contexts/AuthContexts";

const ProductDetail = () => {
  const { loggedIn } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/shop/product/${id}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data : ", error);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const navigate = useNavigate();
  const handleBuy = () => {
    if (!loggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    const productToBuy = {
      boardNum: products.boardNum,
      productName: products.productName,
      productCost: products.productCost,
      thumbnailImg: products.imgThumbnail,
      quantity: quantity,
    };

    navigate(SHOP.ORDER, { state: { items: [productToBuy] } });
  };

  const handleCart = () => {
    if (!loggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    setIsModalOpen(true);
    // console.log(products);
    axios.post("/shop/product/addCart", {
      boardNum: products.boardNum,
      memberId: sessionStorage.getItem("id"),
      productName: products.productName,
      productCost: products.productCost,
      quantity: quantity,
    });
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
  };

  const handleGoToCart = () => {
    setIsModalOpen(false);
    window.location.href = SHOP.CART;
  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <ProductWrapper>
        <ProductContainer>
          <ProductImage src={products.imgThumbnail} />
          <ProductInfo>
            <ProductTitle>{products.productName}</ProductTitle>
            <ProductPrice>
              {products.productCost
                ? `${products.productCost
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`
                : ""}
            </ProductPrice>
            <ProductQuantity>
              <label htmlFor="quantity">구매수량</label>
              <QuantitySelect
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              >
                {[...Array(100).keys()].map((n) => (
                  <option key={n} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </QuantitySelect>
            </ProductQuantity>
            <ButtonsWrapper>
              <BuyButton onClick={handleBuy}>구매하기</BuyButton>
              <CartButton onClick={handleCart}>장바구니</CartButton>
            </ButtonsWrapper>
          </ProductInfo>
        </ProductContainer>
      </ProductWrapper>
      <Line />
      <ProductDescription>제품 상세 정보</ProductDescription>
      <Line />
      <ProductDetailContent
        dangerouslySetInnerHTML={createMarkup(products.productContent)}
      />

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalMessage>장바구니에 추가되었습니다</ModalMessage>
            <ModalButtonsWrapper>
              <ContinueShoppingButton onClick={handleContinueShopping}>
                계속 쇼핑하기
              </ContinueShoppingButton>
              <GoToCartButton onClick={handleGoToCart}>
                장바구니 이동
              </GoToCartButton>
            </ModalButtonsWrapper>
          </ModalContent>
        </Modal>
      )}
    </ThemeProvider>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
`;

const ModalMessage = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ContinueShoppingButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #bfbfbf;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #858585;
  }
  &:focus {
    background-color: #858585;
  }
`;

const GoToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #fbd385;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #af935d;
  }
  &:focus {
    background-color: #af935d;
  }
`;

const theme = createTheme({
  palette: {
    type: "mainColor",
    primary: {
      main: "#FBD385",
    },
  },
});

const ProductWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const ProductContainer = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid #ccc;
  width: 1008px;
`;

const ProductImage = styled.img`
  width: 550px;
  height: 600px;
  margin-right: 3rem;
  padding-top: 25px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
`;

const ProductTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

const ProductPrice = styled.p`
  font-size: 2rem;
  margin-bottom: 20rem;
`;

const ProductQuantity = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: flex-end;
  label {
    margin-right: 1rem;
    font-size: 1.2rem;
  }
`;

const QuantitySelect = styled.select`
  font-size: 1.2rem;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 6rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const CartButton = styled(Button)`
  background-color: #fbd385;
  color: #fff;
  &:hover {
    background-color: #af935d;
  }
  &:focus {
    background-color: #af935d;
  }
`;

const BuyButton = styled(Button)`
  background-color: #fbd385;
  color: #fff;
  &:hover {
    background-color: #af935d;
  }
  &:focus {
    background-color: #af935d;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const Line = styled.hr`
  border: 1px solid rgba(224, 224, 224, 1);
  width: 100%;
  max-width: 1008px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.div`
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
`;

const ProductDetailContent = styled.div`
  text-align: center;
`;

export default ProductDetail;
