const mutingthenoise = require("../miketyson/mutingthenoise/index");
const deejay = require("../miketyson/deejay/index");
import styled from "styled-components";

export default function Home() {

    let button = () => {
    mutingthenoise.getPage(20)
    deejay.getPage(40)
    console.log("ok")
    }
  return (
    <StyledBox>
      <StyledButton onClick={() => button()}>Give me Mike Tyson's power!</StyledButton>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledButton = styled.a`
  padding: 12px 24px;
  border-radius: 48px;
  font-size: ${(props) => props.theme.fontSizes.h3};
  background: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
  margin-top: 12px;
  margin-bottom: 12px;
  text-decoration: none;
  margin-right: 8px;
  cursor: pointer;

  ${(props) =>
    props.tag &&
    css`
      padding: 8px 12px;
      font-size: ${(props) => props.theme.fontSizes.tiny};
      background: none;
      border-radius: 6px;
      border: 1px solid ${(props) => props.theme.colors.gray};
      color: ${(props) => props.theme.colors.white};
      margin-right: 12px;
    `};

  ${(props) =>
    props.active &&
    css`
      background: none;
      border: 1px solid ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.primary};
    `}

  &:hover {
    opacity: 0.75;
  }
`;

