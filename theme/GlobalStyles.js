import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 * {
   box-sizing: border-box;
   padding: 0;
   margin: 0;
 }

 html {
   height:100%;
 }

 body {
   margin-top: 40px;
   /* font-family: Gilroy-Bold; */
   font-family: 'Merriweather', serif;
   font-size: 16px;
   line-height: 1.5rem;
 }


 /* @font-face {
    font-family: "Voyage-Bold";
    src: url("/fonts/Voyage-Bold.otf") format("truetype"),
  }

 @font-face {
    font-family: "Voyage-Regular";
    src: url("/fonts/Voyage-Regular.otf") format("truetype"),
  } */

`;

export default GlobalStyle;
