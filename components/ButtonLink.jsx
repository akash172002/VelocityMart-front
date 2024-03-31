import Link from "next/link";
import styled from "styled-components";
import { ButtonStyled } from "./Button";

const StyledLink = styled(Link)`
  ${ButtonStyled}
`;

export default function ButtonLink(props) {
  return <StyledLink {...props} />;
}
