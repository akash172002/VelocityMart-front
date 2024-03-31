import Center from "@/components/Center";
import FlyingButton from "@/components/FlyingButton";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import ProductReviews from "@/components/ProductReviews";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mogoose";
import { Product } from "@/models/Product";

import styled from "styled-components";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px;
  margin-top: 40px;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.2rem;
`;

const Available = styled.span`
  color: green;
`;

const OutStock = styled.div`
  color: red;
`;

export default function ProductPage({ product }) {
  const stock = parseInt(product.stock);

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <p>
              {stock > 0 ? (
                <Available>Available</Available>
              ) : (
                <OutStock>Out of stock</OutStock>
              )}
            </p>
            <PriceRow>
              <div>
                <Price>&#8377;{product.price}</Price>
              </div>
              {stock > 0 ? (
                <div>
                  <FlyingButton
                    main
                    black
                    id={product._id}
                    src={product?.images?.[0]}
                  >
                    <CartIcon />
                    Add to cart
                  </FlyingButton>
                </div>
              ) : (
                <p>
                  <b>wait for stock</b>
                </p>
              )}
            </PriceRow>
          </div>
        </ColWrapper>
        <ProductReviews product={product} />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
