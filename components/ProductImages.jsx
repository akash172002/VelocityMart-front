import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const BigImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;

const BigImageWrraper = styled.div`
  text-align: center;
`;

const ImagesButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;

const ImageButton = styled.div`
  border: 2px solid #ccc;
  ${(props) =>
    props.active
      ? `
    border-color: #ccc;
    `
      : `border-color: transparent;
      opacity: 0.5;
      `}
  height: 40px;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
  flex-grow: 0;
`;

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrraper>
        <BigImage src={activeImage} alt="" />
      </BigImageWrraper>
      <ImagesButtons>
        {images.map((img) => (
          <ImageButton
            active={img === activeImage}
            key={img}
            onClick={() => setActiveImage(img)}
          >
            <Image src={img} alt="" />
          </ImageButton>
        ))}
      </ImagesButtons>
    </>
  );
}
