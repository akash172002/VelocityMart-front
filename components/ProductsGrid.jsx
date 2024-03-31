import styled from "styled-components";
import ProductBox from "./ProductBox";
import { RevealWrapper } from "next-reveal";

const StyledProductsgrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
`;

export default function ProductsGrid({ products, wishedProduct = [] }) {
  return (
    <StyledProductsgrid interval={100}>
      {products.map((product, index) => (
        <RevealWrapper key={product._id} delay={index * 50}>
          <ProductBox
            {...product}
            wished={wishedProduct.includes(product._id)}
          />
        </RevealWrapper>
      ))}
    </StyledProductsgrid>
  );
}
