import App from 'next/app'
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../theme/GlobalStyles";
import theme from "../theme/Theme";
import "./_app.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
