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
   margin:0;
   font-family: "Voyage-Bold";
   font-size: 16px;
   line-height: 1.5rem;
 }

`;

export default GlobalStyle;
