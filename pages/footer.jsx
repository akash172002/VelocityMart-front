import Center from "@/components/Center";
import styled from "styled-components";

const Background = styled.div`
  background-color: black;
  padding: 10px 0px;
  height: 120px;
  margin-top: 20px;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  color: #fff;
  justify-content: space-between;
`;

const CopyRight = styled.div`
  color: #fff;
`;

const Name = styled.h2`
  font-size: 1rem;
  color: #fff;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Comapny = styled.h4`
  text-align: left;
`;

export default function Footer() {
  return (
    <Background>
      <Center>
        <Box>
          <Details>
            <Comapny>
              Comapny Name: <span>InternPe</span>
            </Comapny>
            <div>
              <Name>
                Created by Akash Chandra Sarraf, Tirth Patel, Akshit Piprotar
              </Name>
            </div>
            <CopyRight>
              All right reserved CopyRight @{new Date().getFullYear()}
            </CopyRight>
          </Details>
        </Box>
      </Center>
    </Background>
  );
}
