import styled from 'styled-components'



export default function Home() {
  return (
      <StyledBox>
        <StyledTitle>Fuck You</StyledTitle>
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

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  color: ${({ theme }) => theme.colors.black};
`;