import styled from "styled-components";

import Link from "next/link";

import FlyingButton from "./FlyingButton";

import { useState } from "react";

import axios from "axios";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";

const ProductWrapper = styled.div`
  button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 10px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`;
const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 2px;
`;

const WishlishtButton = styled.button`
  border: 0;
  width: 40px !important;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  background-color: transparent;

  svg {
    width: 16px;
  }
`;

export default function ProductBox({
  _id,
  title,
  price,
  images,
  wished = false,
  onRemoveFronWishList = () => {},
}) {
  const url = "/product/" + _id;
  const [isWhished, setIsWhished] = useState(wished);

  function addToWhishlist(e) {
    e.stopPropagation();
    e.preventDefault();
    const nextValue = !isWhished;
    if (nextValue === false && onRemoveFronWishList) {
      onRemoveFronWishList(_id);
    }
    axios
      .post("/api/whishlist", {
        product: _id,
      })
      .then(() => {});
    setIsWhished(nextValue);
  }

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <WishlishtButton wished={isWhished} onClick={addToWhishlist}>
            {isWhished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </WishlishtButton>
        </div>
        <img src={images?.[0]} alt="" />
      </WhiteBox>

      <ProductInfoBox>
        <Title href={url}>{title}</Title>

        <PriceRow>
          <Price>₹{price}</Price>
          <FlyingButton _id={_id} src={images?.[0]}>
            Add to cart
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
