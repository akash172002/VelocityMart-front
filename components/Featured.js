import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { RevealWrapper } from "next-reveal";
import FlyingButton from "./FlyingButton";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;

  img.main-img {
    width: 100%;
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export default function Featured({ product }) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin={"left"} delay={0}>
                <Title>{product.title}</Title>
                <Desc>{product.description}</Desc>
                <ButtonsWrapper>
                  <ButtonLink
                    href={"/product/" + product._id}
                    outline={1}
                    white={1}
                  >
                    Read more
                  </ButtonLink>
                  <FlyingButton
                    white={1}
                    _id={product?._id}
                    src={product?.images?.[0]}
                  >
                    <CartIcon />
                    Add to cart
                  </FlyingButton>
                </ButtonsWrapper>
              </RevealWrapper>
            </div>
          </Column>
          <Column>
            <RevealWrapper delay={0}>
              <CenterImg>
                <img
                  className="main-img"
                  src={product.images[0]}
                  alt="macbook"
                />
              </CenterImg>
            </RevealWrapper>
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
