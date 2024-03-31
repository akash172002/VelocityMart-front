import { primary } from "@/lib/colors";
import styled from "styled-components";
import FlyingButtonOriginal from "react-flying-item";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { ButtonStyled } from "./Button";

const FlyingButtonWrapper = styled.div`
  button {
    ${ButtonStyled};

    background-color: transparent;
    color: ${primary};
    border: 1px solid ${primary};
    ${(props) =>
      props.white &&
      `
    background-color: white;
    border: 1px solid white;
    `}
  }
  @keyframes fly {
    100% {
      top: 0;
      left: 70%;
      opacity: 0;
      display: none;
      max-width: 50px;
      max-height: 50px;
    }
  }

  img {
    display: none;
    max-width: 100px;
    max-height: 100px;
    opacity: 1;
    position: fixed;
    display: none;
    z-index: 5;
    animation: fly 1s;
    border-radius: 10px;
  }
`;

export default function FlyingButton(props) {
  const { addProduct } = useContext(CartContext);
  const imgRef = useRef();
  function sendImagetoCart(ev) {
    imgRef.current.style.display = "inline-block";
    imgRef.current.style.left = ev.clientX - 50 + "px";
    imgRef.current.style.top = ev.clientY - 50 + "px";
    setTimeout(() => {
      imgRef.current.style.display = "none";
    }, 1000);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imgRef.current?.closest("div[data-sr-id]");

      if (reveal?.style?.opacity === "1") {
        reveal.style.transform = "none";
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FlyingButtonWrapper
        main={props.main}
        outline
        white={props.white}
        onClick={() => addProduct(props._id)}
      >
        <img src={props.src} ref={imgRef} />
        <button onClick={(ev) => sendImagetoCart(ev, props.src)} {...props} />
      </FlyingButtonWrapper>
    </>
  );
}
