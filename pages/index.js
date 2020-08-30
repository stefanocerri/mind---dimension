import Head from "next/head";
import styled from 'styled-components'



export default function Home() {
  return (
    <StyledBox>
      <Head>
        <title>Mind Dimension - Oh Gosh 🤪</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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