import App from 'next/app'
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../theme/GlobalStyles";
import theme from "../theme/Theme";
import "./_app.css";
import Head from "next/head";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Head>
          <title>Mind Dimension - Oh Gosh &#128588;&#127995;</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link rel="icon" type="image/png" href="/img/favicon.png" />
          <link rel="apple-touch-icon" type="image/png" href="/img/icon.png" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
