import Document, { Head, Html, Main, NextScript } from "next/document";

/**
 * @file _document.js
 * @author Devin Arena
 * @since 1/3/2022
 * @description Updates properties of the main document for NextJS
 */

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
