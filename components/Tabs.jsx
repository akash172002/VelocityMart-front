import styled from "styled-components";

const StyledTabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const StyledTab = styled.span`
  font-size: 1.5rem;
  cursor: pointer;

  ${(props) =>
    props.active
      ? `color: black;
  border-bottom: 2px solid black;
  transition: all;`
      : `color: #999;`}
`;

export default function Tabed({ tabs, active, onChange }) {
  return (
    <StyledTabs>
      {tabs.map((tabName) => (
        <StyledTab
          key={tabName}
          active={tabName === active}
          onClick={() => onChange(tabName)}
        >
          {tabName}
        </StyledTab>
      ))}
    </StyledTabs>
  );
}
