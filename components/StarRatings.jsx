import styled from "styled-components";
import StarOutline from "./icons/StarOutline";
import { useState } from "react";
import StarSolid from "./icons/StarSolid";

const StarsWrapper = styled.div`
  display: flex;
  gap: 1px;
  align-items: center;
  align-items: center;
`;

const StarWrapper = styled.button`
  ${(props) =>
    props.size === "md" &&
    `
  height: 1.4rem;
  width: 1.4rem;
`}
  ${(props) =>
    props.size === "sm" &&
    `
  height: 1rem;
  width: 1rem;
`}

${(props) => props.cursor === "yes" && `cursor:pointer;`}



  padding: 0;
  border: 0;
  display: inline-block;
  background-color: transparent;
`;

export default function StarsRating({
  defaultHowMany = 0,
  onChange = () => {},
  disabled,
  size = "md",
  cursor = "yes",
}) {
  const [howMany, setHowMany] = useState(() => defaultHowMany);

  const five = [1, 2, 3, 4, 5];

  function handleStarClick(n) {
    if (disabled) {
      return;
    }
    setHowMany(n);
    onChange(n);
  }
  return (
    <StarsWrapper>
      {five.map((n) => (
        <>
          <StarWrapper
            value={howMany}
            cursor={cursor}
            size={size}
            onClick={() => handleStarClick(n)}
          >
            {howMany >= n ? <StarSolid /> : <StarOutline />}
          </StarWrapper>
        </>
      ))}
    </StarsWrapper>
  );
}
