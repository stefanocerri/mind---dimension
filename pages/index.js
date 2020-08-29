import styled from 'styled-components'



export default function Home() {
  return <StyledTitle>____Fuck You</StyledTitle>
}


const StyledTitle = styled.div`
  margin-top:144px;
  font-size: ${({ theme }) => theme.fontSizes.hero};
  color: ${({ theme }) => theme.colors.black};
`;